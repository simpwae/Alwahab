import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { getResendClient, getFromEmail } from '../../../../lib/resend';
import { orderConfirmationEmail, adminNewOrderEmail } from '../../../../lib/email-templates';
import { Order, OrderItem } from '../../../../types';

interface OrderItemRow {
  product_id: string;
  name: string;
  image: string | null;
  price: number;
  qty: number;
  size: string | null;
}

interface OrderRow {
  id: string;
  date: string;
  customer: string;
  email: string | null;
  phone: string | null;
  shipping_address: { line1: string; city: string } | null;
  coupon_code: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_method: Order['paymentMethod'];
  payment_status: Order['paymentStatus'];
  fulfillment_status: Order['fulfillmentStatus'];
  receipt_image: string | null;
  tracking_number: string | null;
  payment_reference: string | null;
  order_items: OrderItemRow[];
}

function itemFromRow(row: OrderItemRow): OrderItem {
  return { productId: row.product_id, name: row.name, image: row.image ?? '', price: row.price, qty: row.qty, size: row.size ?? undefined };
}

function orderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    date: row.date,
    customer: row.customer,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    shippingAddress: row.shipping_address ?? undefined,
    couponCode: row.coupon_code ?? undefined,
    items: (row.order_items ?? []).map(itemFromRow),
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    receiptImage: row.receipt_image ?? undefined,
    trackingNumber: row.tracking_number ?? undefined,
    paymentReference: row.payment_reference ?? undefined
  };
}

export async function POST(request: NextRequest) {
  const { orderId } = await request.json();
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: row, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (fetchError || !row) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  const order = orderFromRow(row as OrderRow);

  let resend;
  let fromEmail;
  try {
    resend = getResendClient();
    fromEmail = getFromEmail();
  } catch (err) {
    console.error('Order notify: Resend is not configured', err);
    return NextResponse.json({ skipped: true });
  }

  const results = { customer: false, admin: false };

  if (order.email) {
    try {
      const { subject, html } = orderConfirmationEmail(order);
      await resend.emails.send({ from: fromEmail, to: order.email, subject, html });
      results.customer = true;
    } catch (err) {
      console.error('Order notify: customer email failed', err);
    }
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmail) {
    try {
      const { subject, html } = adminNewOrderEmail(order);
      await resend.emails.send({ from: fromEmail, to: adminEmail, subject, html });
      results.admin = true;
    } catch (err) {
      console.error('Order notify: admin email failed', err);
    }
  }

  return NextResponse.json({ sent: results });
}
