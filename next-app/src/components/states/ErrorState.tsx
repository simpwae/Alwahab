"use client";

import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}
export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this content. Please try again.",
  onRetry
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-14 text-center">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangleIcon className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      {onRetry &&
      <Button
        variant="secondary"
        size="md"
        onClick={onRetry}
        className="mt-5"
        icon={<RefreshCwIcon className="h-4 w-4" />}>

          Retry
        </Button>
      }
    </div>);

}
