import { describe, it, expect } from 'vitest';
import { escapeHtml, orderConfirmationEmail, adminNewOrderEmail } from './email-templates';
import { Order } from '../types';

const baseOrder: Order = {
  id: 'ALW-10001',
  date: '2026-01-01',
  customer: 'Ali',
  email: 'ali@example.com',
  phone: '0300-1234567',
  items: [{ productId: 'p1', name: 'Widget', image: '', price: 100, qty: 1 }],
  subtotal: 100,
  discount: 0,
  shipping: 0,
  total: 100,
  paymentMethod: 'COD',
  paymentStatus: 'Pending',
  fulfillmentStatus: 'Pending'
};

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Ali Khan')).toBe('Ali Khan');
  });
});

describe('email templates', () => {
  it('neutralizes an injected tag in the customer name', () => {
    const order = { ...baseOrder, customer: 'Ali<a href="https://evil.tld">Confirm</a>' };
    const { html } = orderConfirmationEmail(order);
    expect(html).not.toContain('<a href="https://evil.tld">');
    expect(html).toContain('&lt;a href=&quot;https://evil.tld&quot;&gt;');
  });

  it('neutralizes an injected tag in the admin notification', () => {
    const order = { ...baseOrder, phone: '<img src=x onerror=alert(1)>' };
    const { html } = adminNewOrderEmail(order);
    expect(html).not.toContain('<img src=x');
  });

  it('neutralizes an injected tag in an item name', () => {
    const order = { ...baseOrder, items: [{ ...baseOrder.items[0], name: '<script>alert(1)</script>' }] };
    const { html } = orderConfirmationEmail(order);
    expect(html).not.toContain('<script>');
  });
});
