"use client";

import React, { useState, createContext, useContext , ReactNode } from 'react';
import { Review } from '../types';
import { sampleReviews } from '../data/sampleReviews';

interface ReviewContextValue {
  reviews: Review[];
  updateReview: (id: string, patch: Partial<Review>) => void;
}

const ReviewContext = createContext<ReviewContextValue | undefined>(undefined);

export function ReviewProvider({ children }: {children: ReactNode;}) {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  const updateReview = (id: string, patch: Partial<Review>) => {
    setReviews((prev) =>
    prev.map((r) => r.id === id ? { ...r, ...patch } : r)
    );
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
