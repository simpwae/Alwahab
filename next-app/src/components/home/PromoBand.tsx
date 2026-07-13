"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface PromoBandProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}
export function PromoBand({
  eyebrow = 'Limited Time',
  title = 'Bank Transfer Orders Get 5% Extra Off',
  subtitle = 'Pay via Alwahab bank transfer at checkout and save more on every order.',
  ctaLabel = 'Shop Now',
  ctaHref = '/deals'
}: PromoBandProps) {
  const router = useRouter();
  return (
    <section className="overflow-hidden rounded-2xl bg-accent px-6 py-8 text-white sm:px-10 sm:py-10">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            {eyebrow}
          </span>
          <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1.5 max-w-lg text-sm text-white/85">{subtitle}</p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          icon={<ArrowRightIcon className="h-4 w-4" />}
          className="shrink-0 border-none bg-white text-accent-dark hover:bg-white/90 hover:text-accent-dark"
          onClick={() => router.push(ctaHref)}>

          {ctaLabel}
        </Button>
      </div>
    </section>);

}
