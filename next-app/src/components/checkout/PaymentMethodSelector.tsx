"use client";

import React from 'react';
import {
  TruckIcon,
  BuildingIcon,
  CreditCardIcon,
  CheckIcon } from
'lucide-react';
import { PaymentMethod } from '../../types';
interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}
const OPTIONS: PaymentOption[] = [
{
  id: 'COD',
  label: 'Cash on Delivery',
  description: 'Pay in cash when your order arrives.',
  icon: <TruckIcon className="h-5 w-5" />
},
{
  id: 'BankTransfer',
  label: 'Bank Transfer',
  description:
  'Pay via bank transfer and upload your receipt for verification.',
  icon: <BuildingIcon className="h-5 w-5" />
},
{
  id: 'Stripe',
  label: 'Credit / Debit Card',
  description: 'Pay securely online with Stripe.',
  icon: <CreditCardIcon className="h-5 w-5" />
}];

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}
export function PaymentMethodSelector({
  value,
  onChange
}: PaymentMethodSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="space-y-3">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${selected ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>

            <input
              type="radio"
              name="payment-method"
              value={option.id}
              checked={selected}
              onChange={() => onChange(option.id)}
              className="sr-only" />

            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-primary text-white' : 'bg-surface text-ink-muted'}`}>

              {option.icon}
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                {option.label}
                {selected && <CheckIcon className="h-4 w-4 text-primary" />}
              </span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                {option.description}
              </span>
            </span>
          </label>);

      })}
    </div>);

}
