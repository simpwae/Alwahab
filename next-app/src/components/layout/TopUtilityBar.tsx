"use client";

import React from 'react';
import Link from 'next/link';
import { TruckIcon, HelpCircleIcon, MapPinIcon } from 'lucide-react';
export function TopUtilityBar() {
  return (
    <div className="hidden w-full bg-ink text-white sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5">
          <TruckIcon className="h-3.5 w-3.5 text-primary-50" />
          <span>Free delivery on orders above PKR 5,000</span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/track-order"
            className="flex items-center gap-1 hover:text-primary-50 focus-visible:text-primary-50">

            <MapPinIcon className="h-3.5 w-3.5" />
            Track Order
          </Link>
          <Link
            href="/faqs"
            className="flex items-center gap-1 hover:text-primary-50 focus-visible:text-primary-50">

            <HelpCircleIcon className="h-3.5 w-3.5" />
            Help
          </Link>
          <span className="rounded-full border border-white/25 px-2 py-0.5 font-medium">
            PKR
          </span>
        </div>
      </div>
    </div>);

}
