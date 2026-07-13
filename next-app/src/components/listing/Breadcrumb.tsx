"use client";

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">

      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary"
        aria-label="Home">

        <HomeIcon className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={item.label}>
            <ChevronRightIcon
              className="h-3.5 w-3.5 text-gray-300"
              aria-hidden="true" />

            {item.href && !isLast ?
            <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link> :

            <span
              className={isLast ? 'font-medium text-ink' : ''}
              aria-current={isLast ? 'page' : undefined}>

                {item.label}
              </span>
            }
          </Fragment>);

      })}
    </nav>);

}
