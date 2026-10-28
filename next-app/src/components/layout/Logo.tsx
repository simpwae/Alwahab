"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="Alwahab home"
    >
      <Image
        src="/alwahab-logo.png"
        alt="Al Wahab Mart"
        width={496}
        height={126}
        className="block h-10 w-auto max-w-[220px] object-contain sm:h-12"
      />
    </Link>
  );
}
