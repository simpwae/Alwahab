import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { getSafepayClient } from '../../../../lib/safepay';

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
  const notification = body?.data?.notification ?? {};
  const orderId: string | undefined = notification.metadata?.order_id;
  const tracker: string | undefined = notification.tracker;
  const state: string = String(notification.state ?? '').toUpperCase();
  const isPaid = state === 'PAID';

  if (!isPaid) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();
  const query = supabase.from('orders').update({ payment_status: 'Paid' });
  const { error } = orderId
    ? await query.eq('id', orderId)
    : tracker
    ? await query.eq('payment_reference', tracker)
    : { error: new Error('Webhook payload has neither order_id nor tracker.') };

  if (error) {
    console.error('Safepay webhook: could not update order', error);
    return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
