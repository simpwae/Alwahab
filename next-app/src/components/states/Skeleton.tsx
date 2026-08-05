"use client";

import React from 'react';
export function Skeleton({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
      aria-hidden="true" />);


}
export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-soft"
      role="status"
      aria-label="Loading product">

      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="mt-3 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
      <Skeleton className="mt-3 h-5 w-1/2" />
      <Skeleton className="mt-3 h-9 w-full rounded-xl" />
      <span className="sr-only">Loading…</span>
    </div>);

}
export function ProductDetailSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-10 lg:grid-cols-2"
      role="status"
      aria-label="Loading product">

      <div>
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) =>
          <Skeleton key={i} className="h-16 w-16 shrink-0 rounded-xl" />
          )}
        </div>
      </div>
      <div>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2.5 h-7 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <Skeleton className="mt-5 h-24 w-full rounded-2xl" />
        <Skeleton className="mt-5 h-9 w-1/2 rounded-xl" />
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Loading product…</span>
    </div>);

}
export function ProductGridSkeleton({ count = 8 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({
        length: count
      }).map((_, i) =>
      <ProductCardSkeleton key={i} />
      )}
    </div>);

}
