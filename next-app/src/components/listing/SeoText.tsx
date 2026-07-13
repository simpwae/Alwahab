"use client";

import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
interface SeoTextProps {
  title: string;
  paragraphs: string[];
}
export function SeoText({ title, paragraphs }: SeoTextProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="rounded-2xl border border-gray-100 bg-surface p-5 sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
      <div
        className={`relative mt-2 space-y-3 text-sm leading-relaxed text-ink-muted ${expanded ? '' : 'max-h-16 overflow-hidden'}`}>

        {paragraphs.map((p, i) =>
        <p key={i}>{p}</p>
        )}
        {!expanded &&
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
        }
      </div>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark">

        {expanded ? 'Read less' : 'Read more'}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />

      </button>
    </section>);

}
