"use client";

import React from 'react';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="Alwahab home"
    >
      <img
        src="/alwahab-logo.svg"
        alt="Alwahab logo"
        className="block h-10 w-auto max-w-[220px] object-contain sm:h-12"
      />
    </Link>
  );
}
