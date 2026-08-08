"use client";

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { Granularity, formatBucketLabel } from '../../lib/sales';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

function SalesTooltip({ active, payload }: { active?: boolean; payload?: { payload: { date: string; total: number } }[]; granularity: Granularity }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-card">
      <p className="font-medium text-ink">PKR {PKR.format(point.total)}</p>
    </div>
  );
}

// recharts (~400kB) is only ever needed on this one admin dashboard chart -
// isolating it here lets admin/page.tsx dynamic-import it instead of paying
// for it on every route that happens to render the dashboard shell.
export function SalesChart({ salesData, granularity }: { salesData: { date: string; total: number }[]; granularity: Granularity }) {
  return (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E7C6B" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0E7C6B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F1F2F4" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => formatBucketLabel(d, granularity)}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#F1F2F4' }}
            tickLine={false} />
          <YAxis
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40} />
          <Tooltip content={<SalesTooltip granularity={granularity} />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0E7C6B"
            strokeWidth={2}
            fill="url(#salesFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
