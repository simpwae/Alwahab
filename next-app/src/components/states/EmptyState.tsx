"use client";

import React, { ReactNode } from 'react';
import { PackageSearchIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-surface px-6 py-14 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary"
        aria-hidden="true">

        {icon ?? <PackageSearchIcon className="h-8 w-8" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description &&
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      }
      {actionLabel && onAction &&
      <Button variant="primary" size="md" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      }
    </div>);

}
