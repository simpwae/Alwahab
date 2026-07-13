"use client";

import React from 'react';
import {
  TruckIcon,
  RotateCcwIcon,
  BadgeCheckIcon,
  WalletIcon } from
'lucide-react';
const TRUST_ITEMS = [
{
  icon: WalletIcon,
  title: 'Cash on Delivery',
  description: 'Pay when your order arrives at your doorstep.'
},
{
  icon: RotateCcwIcon,
  title: '7-Day Returns',
  description: 'Not happy? Return it within 7 days, no questions asked.'
},
{
  icon: TruckIcon,
  title: 'Fast Delivery',
  description: 'Nationwide delivery, typically within 2–4 business days.'
},
{
  icon: BadgeCheckIcon,
  title: 'Genuine Products',
  description: '100% authentic products, sourced directly from brands.'
}];

export function WhyAlwahab() {
  return (
    <section aria-label="Why shop with Alwahab">
      <div className="mb-6 text-center">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
          Why Alwahab
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Shopping with confidence, every time.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) =>
        <div
          key={item.title}
          className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-soft">

            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
              <item.icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{item.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}
