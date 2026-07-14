"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, ChevronRightIcon } from 'lucide-react';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import {
  StatusBadge,
  FULFILLMENT_STATUS_VARIANT,
  PAYMENT_STATUS_VARIANT } from
'../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/states/EmptyState';
import { useOrders } from '../../../context/OrderContext';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

function AdminOrders() {
  const { orders } = useOrders();

  return (
    <AdminLayout title="Orders">
      {orders.length === 0 ?
      <EmptyState
        icon={<ShoppingBagIcon className="h-8 w-8" />}
        title="No orders yet"
        description="Orders placed by customers will show up here." /> :


      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {orders.map((order) =>
        <li key={order.id}>
              <Link
            href={`/admin/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-surface sm:p-5">

                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    #{order.id}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {order.customer} · {order.date}
                  </p>
                  {(order.phone || order.shippingAddress) &&
              <p className="mt-0.5 hidden text-xs text-ink-muted sm:block">
                      {order.phone}
                      {order.phone && order.shippingAddress && ' · '}
                      {order.shippingAddress && `${order.shippingAddress.line1}, ${order.shippingAddress.city}`}
                    </p>
              }
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">
                    PKR {PKR.format(order.total)}
                  </span>
                  <StatusBadge
                label={order.paymentStatus}
                variant={PAYMENT_STATUS_VARIANT[order.paymentStatus]} />

                  <StatusBadge
                label={order.fulfillmentStatus}
                variant={FULFILLMENT_STATUS_VARIANT[order.fulfillmentStatus]} />

                  <ChevronRightIcon className="h-4 w-4 text-ink-muted" />
                </div>
              </Link>
            </li>
        )}
        </ul>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminOrders />
    </AdminProtectedRoute>);

}
