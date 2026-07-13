"use client";

import React, { Fragment } from 'react';
import {
  CheckIcon,
  ClockIcon,
  PackageIcon,
  TruckIcon,
  HomeIcon,
  XIcon } from
'lucide-react';
import { FulfillmentStatus } from '../../types';
const STEPS: {
  id: FulfillmentStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
{
  id: 'Pending',
  label: 'Pending',
  icon: <ClockIcon className="h-4 w-4" />
},
{
  id: 'Confirmed',
  label: 'Confirmed',
  icon: <PackageIcon className="h-4 w-4" />
},
{
  id: 'Shipped',
  label: 'Shipped',
  icon: <TruckIcon className="h-4 w-4" />
},
{
  id: 'Delivered',
  label: 'Delivered',
  icon: <HomeIcon className="h-4 w-4" />
}];

interface StatusTimelineProps {
  status: FulfillmentStatus;
}
export function StatusTimeline({ status }: StatusTimelineProps) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3.5 text-sm text-red-700">
        <XIcon className="h-5 w-5 shrink-0" />
        This order has been cancelled.
      </div>);

  }
  const activeIndex = STEPS.findIndex((s) => s.id === status);
  return (
    <div className="flex items-start justify-between">
      {STEPS.map((step, i) => {
        const isComplete = i < activeIndex;
        const isCurrent = i === activeIndex;
        const isDone = isComplete || isCurrent;
        return (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isDone ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-ink-muted'}`}>

                {isComplete ? <CheckIcon className="h-4 w-4" /> : step.icon}
              </span>
              <span
                className={`text-xs font-medium ${isDone ? 'text-ink' : 'text-ink-muted'}`}>

                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 &&
            <div
              className={`mt-5 h-0.5 flex-1 ${i < activeIndex ? 'bg-primary' : 'bg-gray-200'}`} />

            }
          </Fragment>);

      })}
    </div>);

}
