"use client";

import React, { ReactNode, useMemo, useState } from 'react';
import {
  WalletIcon,
  ShoppingBagIcon,
  ClockIcon,
  AlertTriangleIcon,
  UsersIcon,
  MessageSquareIcon } from
'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip } from
'recharts';
import { AdminProtectedRoute } from '../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge, FULFILLMENT_STATUS_VARIANT } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { useAdminOrders } from '../../context/OrderContext';
import { useReviews } from '../../context/ReviewContext';
import { useProducts } from '../../context/ProductContext';
import { useCustomers } from '../../context/CustomerContext';
import { Order } from '../../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const UNFULFILLED = new Set(['Pending', 'Confirmed']);

type TileTone = 'primary' | 'info' | 'warning' | 'danger';
const TONE_CLASSES: Record<TileTone, string> = {
  primary: 'bg-primary-50 text-primary',
  info: 'bg-sky-50 text-sky-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700'
};

function StatTile({
  icon,
  label,
  value,
  tone = 'primary'


}: {icon: ReactNode;label: string;value: string;tone?: TileTone;}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>

        {icon}
      </div>
      <p className="mt-3 font-display text-xl font-bold text-ink sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-sm text-ink-muted">{label}</p>
    </div>);

}

export type Granularity = 'daily' | 'monthly';

export function groupSales(orders: Order[], granularity: Granularity) {
  const buckets = new Map<string, number>();
  for (const o of orders) {
    const key = granularity === 'monthly' ? o.date.slice(0, 7) : o.date;
    buckets.set(key, (buckets.get(key) ?? 0) + o.total);
  }
  return [...buckets.entries()].
  sort(([a], [b]) => a.localeCompare(b)).
  map(([date, total]) => ({ date, total }));
}

export function formatBucketLabel(date: string, granularity: Granularity) {
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day || 1);
  return parsed.toLocaleDateString('en-US',
  granularity === 'monthly' ? { month: 'short', year: 'numeric' } : { month: 'short', day: 'numeric' }
  );
}

function SalesTooltip({ active, payload }: { active?: boolean; payload?: { payload: { date: string; total: number }; }[]; granularity: Granularity; }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-card">
      <p className="font-medium text-ink">PKR {PKR.format(point.total)}</p>
    </div>);

}

function AdminDashboard() {
  const { orders } = useAdminOrders();
  const { reviews } = useReviews();
  const { products } = useProducts();
  const { customers } = useCustomers();
  const [granularity, setGranularity] = useState<Granularity>('daily');
  const salesData = useMemo(() => groupSales(orders, granularity), [orders, granularity]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) =>
  UNFULFILLED.has(o.fulfillmentStatus)
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.stockQty <= p.lowStockThreshold
  ).length;
  const pendingReviews = reviews.filter(
    (r) => r.status === 'Pending'
  ).length;
  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          icon={<WalletIcon className="h-5 w-5" />}
          label="Total Revenue"
          value={`PKR ${PKR.format(totalRevenue)}`} />

        <StatTile
          icon={<ShoppingBagIcon className="h-5 w-5" />}
          label="Total Orders"
          value={String(orders.length)}
          tone="info" />

        <StatTile
          icon={<ClockIcon className="h-5 w-5" />}
          label="Pending Orders"
          value={String(pendingOrders)}
          tone="warning" />

        <StatTile
          icon={<AlertTriangleIcon className="h-5 w-5" />}
          label="Low Stock Products"
          value={String(lowStockProducts)}
          tone="danger" />

        <StatTile
          icon={<UsersIcon className="h-5 w-5" />}
          label="Total Customers"
          value={String(customers.length)}
          tone="primary" />

        <StatTile
          icon={<MessageSquareIcon className="h-5 w-5" />}
          label="Pending Reviews"
          value={String(pendingReviews)}
          tone="warning" />

      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink">
            Sales Overview
          </h2>
          <div className="flex rounded-xl border border-gray-200 p-0.5 text-sm">
            {(['daily', 'monthly'] as Granularity[]).map((g) =>
            <button
              key={g}
              type="button"
              onClick={() => setGranularity(g)}
              className={`rounded-lg px-3 py-1.5 font-medium capitalize transition-colors ${granularity === g ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'}`}>

                {g}
              </button>
            )}
          </div>
        </div>

        {salesData.length === 0 ?
        <EmptyState
          icon={<WalletIcon className="h-8 w-8" />}
          title="No sales data yet"
          description="Sales will appear here once orders come in." /> :

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
        }
      </div>

      <h2 className="mt-8 font-display text-lg font-bold text-ink">
        Recent Orders
      </h2>

      {recentOrders.length === 0 ?
      <EmptyState
        icon={<ShoppingBagIcon className="h-8 w-8" />}
        title="No orders yet"
        description="New orders will show up here as customers check out." /> :


      <ul className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {recentOrders.map((order) =>
        <li
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">

              <div>
                <p className="font-display text-sm font-bold text-ink">
                  #{order.id}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {order.customer} · {order.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">
                  PKR {PKR.format(order.total)}
                </span>
                <StatusBadge
              label={order.fulfillmentStatus}
              variant={FULFILLMENT_STATUS_VARIANT[order.fulfillmentStatus]} />

              </div>
            </li>
        )}
        </ul>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>);

}
