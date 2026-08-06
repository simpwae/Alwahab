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

  // Logged deliberately: Safepay's docs don't pin down the exact field name/value
  // for a completed payment, so this is here to confirm it against a real sandbox
  // event rather than guessing blind.
  console.log('Safepay webhook payload', JSON.stringify(body));

  const data = body?.data ?? {};
  const orderId: string | undefined = data.order_id ?? data.metadata?.order_id;
  const tracker: string | undefined = data.tracker;
  const state: string = String(data.state ?? data.status ?? '').toUpperCase();
  const isPaid = state.includes('PAID') || state.includes('COMPLETE') || state.includes('SUCCESS');

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
