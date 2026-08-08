import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { getSafepayClient } from '../../../../lib/safepay';
import { claimWebhookEvent } from '../../../../lib/idempotency';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const headers = Object.fromEntries(request.headers);

  let safepay;
  try {
    safepay = getSafepayClient();
  } catch (err) {
    console.error('Safepay webhook received but Safepay is not configured', err);
    return NextResponse.json({ error: 'Safepay is not configured.' }, { status: 500 });
  }

  const isValid = safepay.verify.webhook({ body, headers });
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  // Confirmed shape from a real sandbox `payment:created` event - the useful
  // fields sit under data.notification, not directly under data.
  const notification = body?.data?.notification;
  if (!notification || typeof notification !== 'object') {
    return NextResponse.json({ error: 'Malformed webhook payload.' }, { status: 400 });
  }

  const orderId: string | undefined = typeof notification.metadata?.order_id === 'string' ? notification.metadata.order_id : undefined;
  const tracker: string | undefined = typeof notification.tracker === 'string' ? notification.tracker : undefined;
  const state: string = String(notification.state ?? '').toUpperCase();
  const isPaid = state === 'PAID';
  const paidAmount = typeof notification.amount === 'number' ? notification.amount : Number(notification.amount);

  if (!isPaid) {
    return NextResponse.json({ received: true });
  }
  if (!orderId && !tracker) {
    console.error('Safepay webhook: payload has neither order_id nor tracker', notification);
    return NextResponse.json({ error: 'Webhook payload has neither order_id nor tracker.' }, { status: 400 });
  }

  // Dedup: a captured valid (body, signature) pair is otherwise replayable
  // indefinitely. Uses the event id if Safepay provides one, else falls
  // back to a tracker/order+state composite - best-effort, the
  // payment_status='Pending' precondition below is the primary guard.
  const eventKey: string = typeof body?.data?.id === 'string' ? body.data.id : `${orderId ?? tracker}:${state}`;
  const isNewEvent = await claimWebhookEvent(eventKey);
  if (!isNewEvent) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error('Safepay webhook: admin client not configured', err);
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 500 });
  }

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, total, payment_status')
    .match(orderId ? { id: orderId } : { payment_reference: tracker })
    .maybeSingle();

  if (fetchError || !order) {
    console.error('Safepay webhook: order not found', fetchError, { orderId, tracker });
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  // Never mark an order Paid for less than it's worth, and never resurrect
  // an order an admin has already reverted (refund, cancellation) out of
  // 'Pending' - the .eq below only updates rows still awaiting payment.
  if (Number.isFinite(paidAmount) && Math.abs(paidAmount - order.total) > 1) {
    console.error('Safepay webhook: amount mismatch', { orderId: order.id, expected: order.total, paid: paidAmount });
    return NextResponse.json({ error: 'Amount mismatch.' }, { status: 409 });
  }

  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'Paid' })
    .eq('id', order.id)
    .eq('payment_status', 'Pending');

  if (error) {
    console.error('Safepay webhook: could not update order', error);
    return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
