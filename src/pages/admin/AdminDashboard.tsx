import React from 'react';
import {
  WalletIcon,
  ShoppingBagIcon,
  ClockIcon,
  AlertTriangleIcon,
  UsersIcon,
  MessageSquareIcon } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge, FULFILLMENT_STATUS_VARIANT } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { useOrders } from '../../context/OrderContext';
import { sampleProducts } from '../../data/sampleProducts';
import { sampleUsers } from '../../data/sampleUsers';
import { sampleReviews } from '../../data/sampleReviews';

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

export function AdminDashboard() {
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) =>
  UNFULFILLED.has(o.fulfillmentStatus)
  ).length;
  const lowStockProducts = sampleProducts.filter(
    (p) => p.stockQty <= p.lowStockThreshold
  ).length;
  const pendingReviews = sampleReviews.filter(
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
          value={String(sampleUsers.length)}
          tone="primary" />

        <StatTile
          icon={<MessageSquareIcon className="h-5 w-5" />}
          label="Pending Reviews"
          value={String(pendingReviews)}
          tone="warning" />

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
