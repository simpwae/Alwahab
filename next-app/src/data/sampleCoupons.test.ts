import { describe, it, expect } from 'vitest';
import { findValidCoupon, calculateDiscount } from './sampleCoupons';
import { Coupon } from '../types';

const coupons: Coupon[] = [
{ code: 'TEN', type: '%', value: 10, minOrder: 1000, usageLimit: 10, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
{ code: 'FLAT500', type: 'flat', value: 500, minOrder: 2000, usageLimit: 10, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
{ code: 'OLD', type: '%', value: 20, minOrder: 0, usageLimit: 10, validFrom: '2025-01-01', validTo: '2025-12-31', status: 'Expired' }];


describe('findValidCoupon', () => {
  it('matches case-insensitively and trims whitespace', () => {
    const { coupon, error } = findValidCoupon(' ten ', 1500, coupons);
    expect(error).toBeNull();
    expect(coupon?.code).toBe('TEN');
  });

  it('rejects an unknown code', () => {
    const { coupon, error } = findValidCoupon('NOPE', 1500, coupons);
    expect(coupon).toBeNull();
    expect(error).toBe('Invalid promo code.');
  });

  it('rejects an expired coupon', () => {
    const { coupon, error } = findValidCoupon('OLD', 1500, coupons);
    expect(coupon).toBeNull();
    expect(error).toMatch(/expired/i);
  });

  it('rejects when subtotal is below minOrder', () => {
    const { coupon, error } = findValidCoupon('FLAT500', 500, coupons);
    expect(coupon).toBeNull();
    expect(error).toMatch(/minimum order/i);
  });
});

describe('calculateDiscount', () => {
  it('computes a percentage discount', () => {
    expect(calculateDiscount(coupons[0], 1500)).toBe(150);
  });

  it('computes a flat discount', () => {
    expect(calculateDiscount(coupons[1], 3000)).toBe(500);
  });

  it('caps a flat discount at the subtotal', () => {
    expect(calculateDiscount(coupons[1], 300)).toBe(300);
  });
});
