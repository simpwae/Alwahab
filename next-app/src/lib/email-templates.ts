import { Order } from '../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

// order.customer/email/phone/shippingAddress and every item.name/size are
// end-user-supplied (place_order's text params) and interpolated raw into
// these templates. Without this, a checkout name like
// 'Ali<a href="https://evil.tld">Confirm payment</a>' becomes a working
// link in both the customer confirmation and the admin notification email,
// sent from the verified sending domain.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PAYMENT_METHOD_LABEL: Record<Order['paymentMethod'], string> = {
  COD: 'Cash on Delivery',
  BankTransfer: 'Bank Transfer',
  Safepay: 'Credit / Debit Card'
};

function itemsRows(order: Order): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;">
            ${escapeHtml(item.name)}${item.size ? ` (Size ${escapeHtml(item.size)})` : ''}<br/>
            <span style="color:#777;font-size:12px;">Qty ${item.qty} &times; PKR ${PKR.format(item.price)}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;text-align:right;">
            PKR ${PKR.format(item.price * item.qty)}
          </td>
        </tr>`
    )
    .join('');
}

function wrapper(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#0E7C6B;padding:20px 24px;border-radius:12px 12px 0 0;">
      <span style="color:#fff;font-size:18px;font-weight:bold;">Alwahab</span>
    </div>
    <div style="background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      <h1 style="font-size:18px;color:#111;margin:0 0 12px;">${title}</h1>
      ${bodyHtml}
    </div>
    <p style="font-size:12px;color:#999;text-align:center;margin-top:16px;">Alwahab &middot; alwahabmart.com</p>
  </div>`;
}

export function orderConfirmationEmail(order: Order): { subject: string; html: string } {
  const body = `
    <p style="font-size:14px;color:#444;">Hi ${escapeHtml(order.customer)}, thanks for your order! Here's a summary:</p>
    <p style="font-size:14px;color:#111;margin:16px 0 4px;"><strong>Order ${order.id}</strong></p>
    <table style="width:100%;border-collapse:collapse;">${itemsRows(order)}</table>
    <table style="width:100%;margin-top:12px;font-size:14px;color:#444;">
      <tr><td>Subtotal</td><td style="text-align:right;">PKR ${PKR.format(order.subtotal)}</td></tr>
      ${order.discount ? `<tr><td>Discount</td><td style="text-align:right;">-PKR ${PKR.format(order.discount)}</td></tr>` : ''}
      <tr><td>Shipping</td><td style="text-align:right;">${order.shipping ? `PKR ${PKR.format(order.shipping)}` : 'Free'}</td></tr>
      <tr><td style="font-weight:bold;color:#111;padding-top:6px;">Total</td><td style="text-align:right;font-weight:bold;color:#111;padding-top:6px;">PKR ${PKR.format(order.total)}</td></tr>
    </table>
    <p style="font-size:14px;color:#444;margin-top:16px;">
      Payment method: ${PAYMENT_METHOD_LABEL[order.paymentMethod]}<br/>
      ${order.shippingAddress ? `Shipping to: ${escapeHtml(order.shippingAddress.line1)}, ${escapeHtml(order.shippingAddress.city)}` : ''}
    </p>
    <p style="font-size:14px;color:#444;">You can track this order anytime at
      <a href="https://alwahabmart.com/track-order" style="color:#0E7C6B;">alwahabmart.com/track-order</a>.
    </p>`;
  return { subject: `Order confirmed - ${order.id}`, html: wrapper('Order Confirmed', body) };
}

export function adminNewOrderEmail(order: Order): { subject: string; html: string } {
  const body = `
    <p style="font-size:14px;color:#444;">New order placed on Alwahab.</p>
    <p style="font-size:14px;color:#111;margin:16px 0 4px;"><strong>Order ${order.id}</strong></p>
    <table style="width:100%;border-collapse:collapse;">${itemsRows(order)}</table>
    <p style="font-size:14px;color:#111;font-weight:bold;margin-top:12px;">Total: PKR ${PKR.format(order.total)}</p>
    <p style="font-size:14px;color:#444;">
      Customer: ${escapeHtml(order.customer)}${order.email ? ` (${escapeHtml(order.email)})` : ''}${order.phone ? ` &middot; ${escapeHtml(order.phone)}` : ''}<br/>
      Payment: ${PAYMENT_METHOD_LABEL[order.paymentMethod]} &middot; ${order.paymentStatus}
    </p>
    <p style="font-size:14px;">
      <a href="https://alwahabmart.com/admin/orders/${order.id}" style="color:#0E7C6B;">View order in admin panel</a>
    </p>`;
  return { subject: `New order - ${order.id} (PKR ${PKR.format(order.total)})`, html: wrapper('New Order', body) };
}
