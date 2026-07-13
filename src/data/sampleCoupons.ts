import { Coupon } from '../types';

export const sampleCoupons: Coupon[] = [
{
  code: 'WELCOME10',
  type: '%',
  value: 10,
  minOrder: 1000,
  usageLimit: 500,
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  status: 'Active'
},
{
  code: 'SAVE500',
  type: 'flat',
  value: 500,
  minOrder: 3000,
  usageLimit: 200,
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  status: 'Active'
},
{
  code: 'EXPIRED20',
  type: '%',
  value: 20,
  minOrder: 0,
  usageLimit: 100,
  validFrom: '2025-01-01',
  validTo: '2025-12-31',
  status: 'Expired'
}];


export function findValidCoupon(
code: string,
subtotal: number,
coupons: Coupon[] = sampleCoupons)
: {coupon: Coupon | null;error: string | null;} {
  const match = coupons.find(
    (c) => c.code.toLowerCase() === code.trim().toLowerCase()
  );
  if (!match) return { coupon: null, error: 'Invalid promo code.' };
  if (match.status !== 'Active')
  return { coupon: null, error: 'This promo code has expired.' };
  if (subtotal < match.minOrder) {
    return {
      coupon: null,
      error: `Minimum order of PKR ${match.minOrder.toLocaleString()} required for this code.`
    };
  }
  return { coupon: match, error: null };
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === '%') return Math.round(subtotal * coupon.value / 100);
  return Math.min(coupon.value, subtotal);
}