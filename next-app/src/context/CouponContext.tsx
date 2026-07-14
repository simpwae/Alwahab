"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Coupon } from '../types';
import { createClient } from '../lib/supabase/client';

// Reads are public (coupons_select_public); writes require an authenticated
// admin (coupons_write_admin checks is_admin()), so this context talks to
// the admin-keyed client, same pattern as StoreSettingsContext/ReviewContext.
const supabase = createClient('alwahab-admin-auth');

interface CouponContextValue {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => Promise<string | null>;
  updateCoupon: (code: string, patch: Partial<Coupon>) => Promise<string | null>;
  deleteCoupon: (code: string) => Promise<string | null>;
  deleteCoupons: (codes: string[]) => Promise<string | null>;
}

const CouponContext = createContext<CouponContextValue | undefined>(undefined);

interface CouponRow {
  code: string;
  type: '%' | 'flat';
  value: number;
  min_order: number;
  usage_limit: number;
  valid_from: string;
  valid_to: string;
  status: Coupon['status'];
}

function fromRow(row: CouponRow): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    minOrder: row.min_order,
    usageLimit: row.usage_limit,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    status: row.status
  };
}

function toRow(coupon: Coupon): CouponRow {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    min_order: coupon.minOrder,
    usage_limit: coupon.usageLimit,
    valid_from: coupon.validFrom,
    valid_to: coupon.validTo,
    status: coupon.status
  };
}

export function CouponProvider({ children }: {children: ReactNode;}) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    supabase.from('coupons').select('*').then(({ data }) => {
      setCoupons((data ?? []).map((row) => fromRow(row as CouponRow)));
    });
  }, []);

  const addCoupon = async (coupon: Coupon) => {
    const { error } = await supabase.from('coupons').insert(toRow(coupon));
    if (error) return error.message;
    setCoupons((prev) => [coupon, ...prev]);
    return null;
  };

  const updateCoupon = async (code: string, patch: Partial<Coupon>) => {
    const existing = coupons.find((c) => c.code === code);
    if (!existing) return 'Coupon not found.';
    const next = { ...existing, ...patch };
    const { error } = await supabase.from('coupons').update(toRow(next)).eq('code', code);
    if (error) return error.message;
    setCoupons((prev) => prev.map((c) => c.code === code ? next : c));
    return null;
  };

  const deleteCoupon = async (code: string) => {
    const { error } = await supabase.from('coupons').delete().eq('code', code);
    if (error) return error.message;
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    return null;
  };

  const deleteCoupons = async (codes: string[]) => {
    const { error } = await supabase.from('coupons').delete().in('code', codes);
    if (error) return error.message;
    const codeSet = new Set(codes);
    setCoupons((prev) => prev.filter((c) => !codeSet.has(c.code)));
    return null;
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
