"use client";

import React from 'react';
export type BadgeVariant =
'success' |
'neutral' |
'danger' |
'warning' |
'accent' |
'info';
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  neutral: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  accent: 'bg-accent-50 text-accent-dark ring-1 ring-inset ring-accent-100',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200'
};
// Central mapping so customer & admin sides always agree on status colors.
export const PRODUCT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  Active: 'success',
  Draft: 'neutral',
  OutOfStock: 'danger'
};
export const PAYMENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  Paid: 'success',
  AwaitingVerification: 'warning',
  Pending: 'neutral',
  Failed: 'danger'
};
export const FULFILLMENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  Pending: 'neutral',
  Confirmed: 'info',
  Shipped: 'warning',
  Delivered: 'success',
  Cancelled: 'danger'
};
interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}
export function StatusBadge({
  label,
  variant = 'neutral',
  className = ''
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${VARIANT_CLASSES[variant]} ${className}`}>

      {label}
    </span>);

}
