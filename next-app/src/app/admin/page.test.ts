import { describe, it, expect } from 'vitest';
import { groupSales, formatBucketLabel } from './page';
import { Order } from '../../types';

function makeOrder(date: string, total: number): Order {
  return {
    id: `o-${date}-${total}`,
    date,
    customer: 'Test Customer',
    items: [],
    subtotal: total,
    discount: 0,
    shipping: 0,
    total,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Pending'
  };
}

describe('groupSales', () => {
  it('sums totals per day', () => {
    const orders = [makeOrder('2026-06-01', 100), makeOrder('2026-06-01', 50), makeOrder('2026-06-02', 20)];
    expect(groupSales(orders, 'daily')).toEqual([
    { date: '2026-06-01', total: 150 },
    { date: '2026-06-02', total: 20 }]
    );
  });

  it('sums totals per month', () => {
    const orders = [makeOrder('2026-06-01', 100), makeOrder('2026-06-28', 50), makeOrder('2026-07-02', 20)];
    expect(groupSales(orders, 'monthly')).toEqual([
    { date: '2026-06', total: 150 },
    { date: '2026-07', total: 20 }]
    );
  });

  it('returns an empty array for no orders', () => {
    expect(groupSales([], 'daily')).toEqual([]);
  });
});

describe('formatBucketLabel', () => {
  it('formats a daily bucket as month + day', () => {
    expect(formatBucketLabel('2026-06-05', 'daily')).toBe('Jun 5');
  });

  it('formats a monthly bucket as month + year', () => {
    expect(formatBucketLabel('2026-06', 'monthly')).toBe('Jun 2026');
  });
});
