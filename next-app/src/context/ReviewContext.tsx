"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Review, ReviewStatus } from '../types';
import { createClient } from '../lib/supabase/client';

// Admin-keyed client for both read and write: RLS's
// reviews_select_approved_or_admin returns only Approved rows unless the
// session is an admin, so a customer/anonymous browser naturally sees the
// same Approved-only set it always did, while the admin moderation view
// (which needs Pending/Rejected too) works without any branching logic here.
const supabase = createClient('alwahab-admin-auth');

interface ReviewContextValue {
  reviews: Review[];
  updateReview: (id: string, patch: Partial<Review>) => Promise<string | null>;
}

const ReviewContext = createContext<ReviewContextValue | undefined>(undefined);

interface ReviewRow {
  id: string;
  product_id: string;
  customer: string;
  rating: number;
  title: string | null;
  comment: string;
  date: string;
  status: ReviewStatus;
  verified_purchase: boolean;
}

function fromRow(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    customer: row.customer,
    rating: row.rating,
    title: row.title ?? undefined,
    comment: row.comment,
    date: row.date,
    status: row.status,
    verifiedPurchase: row.verified_purchase
  };
}

export function ReviewProvider({ children }: {children: ReactNode;}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase.from('reviews').select('*').then(({ data }) => {
      setReviews((data ?? []).map((row) => fromRow(row as ReviewRow)));
    });
  }, []);

  const updateReview = async (id: string, patch: Partial<Review>) => {
    const { error } = await supabase.
    from('reviews').
    update({ status: patch.status }).
    eq('id', id);
    if (error) return error.message;
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r));
    return null;
  };

  return (
    <ReviewContext.Provider value={{ reviews, updateReview }}>
      {children}
    </ReviewContext.Provider>);

}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
