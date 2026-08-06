import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { getSafepayClient } from '../../../../lib/safepay';

export async function POST(request: NextRequest) {
  const { orderId } = await request.json();
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, total, payment_method, payment_status')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (order.payment_method !== 'Safepay' || order.payment_status !== 'Pending') {
    return NextResponse.json({ error: 'Order is not awaiting Safepay payment.' }, { status: 400 });
  }

  let safepay;
  try {
    safepay = getSafepayClient();
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Safepay is not configured.' }, { status: 500 });
  }

  try {
    const { token } = await safepay.payments.create({ amount: order.total, currency: 'PKR' });

    await supabase.from('orders').update({ payment_reference: token }).eq('id', orderId);

    const origin = request.nextUrl.origin;
    const url = safepay.checkout.create({
      token,
      orderId: order.id,
      redirectUrl: `${origin}/order-confirmation/${order.id}`,
      cancelUrl: `${origin}/checkout?cancelled=1`,
      source: 'custom',
      webhooks: true
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Safepay checkout creation failed', err);
    return NextResponse.json({ error: 'Could not start Safepay checkout.' }, { status: 502 });
  }
}
