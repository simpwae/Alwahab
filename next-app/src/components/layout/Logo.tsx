"use client";

import React from 'react';
import Link from 'next/link';
export function Logo({ className = '' }: {className?: string;}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-0.5 font-display text-2xl font-extrabold text-ink ${className}`}>

      Alwahab
      <span
        className="mb-3 h-2 w-2 rounded-full bg-accent"
        aria-hidden="true" />

    </Link>);

}
