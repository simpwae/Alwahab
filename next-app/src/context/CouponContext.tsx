"use client";

import React, { useState, createContext, useContext , ReactNode } from 'react';
import { Coupon } from '../types';
import { sampleCoupons } from '../data/sampleCoupons';

interface CouponContextValue {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  deleteCoupons: (codes: string[]) => void;
}

const CouponContext = createContext<CouponContextValue | undefined>(undefined);

export function CouponProvider({ children }: {children: ReactNode;}) {
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };
  const updateCoupon = (code: string, patch: Partial<Coupon>) => {
    setCoupons((prev) =>
    prev.map((c) => c.code === code ? { ...c, ...patch } : c)
    );
  };
  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };
  const deleteCoupons = (codes: string[]) => {
    const codeSet = new Set(codes);
    setCoupons((prev) => prev.filter((c) => !codeSet.has(c.code)));
  };

  return (
    <CouponContext.Provider
      value={{ coupons, addCoupon, updateCoupon, deleteCoupon, deleteCoupons }}>
      {children}
    </CouponContext.Provider>);

}

export function useCoupons() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupons must be used within CouponProvider');
  return ctx;
}
