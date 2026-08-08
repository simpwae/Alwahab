"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  WalletIcon,
  ShoppingBagIcon,
  ClockIcon,
  AlertTriangleIcon,
  UsersIcon,
  MessageSquareIcon } from
'lucide-react';
import { AdminProtectedRoute } from '../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge, FULFILLMENT_STATUS_VARIANT } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { ErrorState } from '../../components/states/ErrorState';
import { Skeleton } from '../../components/states/Skeleton';
import { createClient } from '../../lib/supabase/client';
import { Granularity } from '../../lib/sales';
import { FulfillmentStatus } from '../../types';

const supabase = createClient('alwahab-admin-auth');

// recharts is ~400kB and only used by this one chart - load it only when
// the dashboard actually renders, instead of paying for it in every bundle
// that happens to include this route.
const SalesChart = dynamic(() => import('../../components/admin/SalesChart').then((m) => m.SalesChart), {
  ssr: false,
  loading: () => <div className="mt-4 h-64 w-full animate-pulse rounded-xl bg-surface" />
});

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

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

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalCustomers: number;
  pendingReviews: number;
  recentOrders: { id: string; date: string; customer: string; total: number; fulfillmentStatus: FulfillmentStatus }[];
  salesData: { date: string; total: number }[];
}

function StatTileSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:p-5">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="mt-3 h-6 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>);

}

function AdminDashboard() {
  const [granularity, setGranularity] = useState<Granularity>('daily');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Previously this page pulled every order (with every line item), every
  // product, every review, and every customer into the browser via the
  // global admin contexts just to compute a handful of numbers - now it's
  // one SQL aggregate (see admin_dashboard_stats() in
  // supabase/migrations/20260808120200_admin_dashboard_stats.sql) whose
  // response size stays flat as order history grows.
  const loadStats = React.useCallback(() => {
    setStatus('loading');
    supabase.rpc('admin_dashboard_stats', { p_granularity: granularity }).then(({ data, error }) => {
      if (error || !data) {
        setStatus('error');
        return;
      }
      setStats(data as DashboardStats);
      setStatus('success');
    });
  }, [granularity]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (status === 'error') {
    return (
      <AdminLayout title="Dashboard">
        <ErrorState onRetry={loadStats} />
      </AdminLayout>);

  }

  if (status === 'loading' || !stats) {
    return (
      <AdminLayout title="Dashboard">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <StatTileSkeleton key={i} />)}
        </div>
      </AdminLayout>);

  }

  const { totalRevenue, totalOrders, pendingOrders, lowStockProducts, totalCustomers, pendingReviews, recentOrders, salesData } = stats;

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
          value={String(totalOrders)}
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
          value={String(totalCustomers)}
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

        <SalesChart salesData={salesData} granularity={granularity} />
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
