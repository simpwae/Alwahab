"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, ChevronRightIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import {
  StatusBadge,
  FULFILLMENT_STATUS_VARIANT,
  PAYMENT_STATUS_VARIANT } from
'../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/states/EmptyState';
import { useAdminOrders } from '../../../context/OrderContext';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

function AdminOrders() {
  const { orders, deleteOrder, deleteOrders } = useAdminOrders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id));

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : orders.map((o) => o.id));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete order "${id}"? This can't be undone.`)) return;
    const error = await deleteOrder(id);
    if (error) toast.error(error);
    else toast.success('Order deleted');
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} order${selectedIds.length > 1 ? 's' : ''}? This can't be undone.`)) return;
    const error = await deleteOrders(selectedIds);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedIds([]);
    toast.success(`${selectedIds.length} order${selectedIds.length > 1 ? 's' : ''} deleted`);
  };

  return (
    <AdminLayout title="Orders">
      {orders.length === 0 ?
      <EmptyState
        icon={<ShoppingBagIcon className="h-8 w-8" />}
        title="No orders yet"
        description="Orders placed by customers will show up here." /> :


      <>
          <div className="mb-4 flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-ink-muted">
              <input
              type="checkbox"
              aria-label="Select all"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

              Select all
            </label>
            {selectedIds.length > 0 &&
          <>
                <span className="text-ink-muted">{selectedIds.length} selected</span>
                <button
              type="button"
              onClick={handleBulkDelete}
              className="rounded-lg px-3 py-1.5 font-medium text-red-600 hover:bg-red-50">

                  Delete Selected
                </button>
              </>
          }
          </div>

          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {orders.map((order) =>
          <li key={order.id} className="flex items-center gap-2 p-4 sm:p-5">
                <input
              type="checkbox"
              aria-label={`Select ${order.id}`}
              checked={selectedIds.includes(order.id)}
              onChange={() => toggleSelected(order.id)}
              className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/20" />

                <Link
              href={`/admin/orders/${order.id}`}
              className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3 rounded-xl p-2 transition-colors hover:bg-surface">

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
                <button
              type="button"
              aria-label={`Delete ${order.id}`}
              onClick={() => handleDelete(order.id)}
              className="shrink-0 rounded-lg p-2 text-ink-muted hover:bg-red-50 hover:text-red-600">

                  <Trash2Icon className="h-4 w-4" />
                </button>
              </li>
          )}
          </ul>
        </>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminOrders />
    </AdminProtectedRoute>);

}
