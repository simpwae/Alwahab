import { Coupon } from '../types';

export function findValidCoupon(
code: string,
subtotal: number,
coupons: Coupon[])
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