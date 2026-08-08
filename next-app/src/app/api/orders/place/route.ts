import { NextRequest, NextResponse } from 'next/server';
import { createUserScopedClient, getClientIp } from '../../../../lib/supabase/user-scoped';
import { checkRateLimit } from '../../../../lib/rate-limit';
import { issueOrderToken } from '../../../../lib/idempotency';

const RATE_LIMIT_MESSAGE = 'Too many attempts. Please wait a few minutes and try again.';
function friendlyError(message: string) {
  return message.includes('rate_limit_exceeded') ? RATE_LIMIT_MESSAGE : message;
}

interface PlaceOrderBody {
  accessToken?: string | null;
  userId?: string | null;
  customer: string;
  email: string;
  phone: string;
  shippingAddress: { line1: string; city: string };
  couponCode?: string | null;
  items: { productId: string; name: string; image: string; price: number; qty: number; size?: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'COD' | 'BankTransfer' | 'Safepay';
  paymentStatus: string;
  receiptImage?: string | null;
}

export async function POST(request: NextRequest) {
  let body: PlaceOrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  }

  const rateLimitKey = body.userId ?? getClientIp(request.headers);
  const { success } = await checkRateLimit('placeOrder', rateLimitKey);
  if (!success) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const supabase = createUserScopedClient(body.accessToken);

  const { data, error } = await supabase.rpc('place_order', {
    p_user_id: body.userId ?? null,
    p_customer: body.customer,
    p_email: body.email,
    p_phone: body.phone,
    p_shipping_address: body.shippingAddress,
    p_coupon_code: body.couponCode ?? null,
    p_subtotal: body.subtotal,
    p_discount: body.discount,
    p_shipping: body.shipping,
    p_total: body.total,
    p_payment_method: body.paymentMethod,
    p_payment_status: body.paymentStatus,
    p_receipt_image: body.receiptImage ?? null,
    p_items: body.items.map((i) => ({
      product_id: i.productId, name: i.name, image: i.image, price: i.price, qty: i.qty, size: i.size ?? null
    }))
  });

  if (error) {
    return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 });
  }

  const order = data as { id: string };
  const [notifyToken, checkoutToken] = await Promise.all([
    issueOrderToken(order.id, 'notify'),
    issueOrderToken(order.id, 'safepay-checkout')
  ]);

  return NextResponse.json({ order: data, notifyToken, checkoutToken });
}
