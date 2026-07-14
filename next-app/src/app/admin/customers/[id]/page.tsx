"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserIcon, PackageSearchIcon, ChevronRightIcon } from 'lucide-react';
import { AdminProtectedRoute } from '../../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../../components/admin/AdminLayout';
import {
  StatusBadge,
  FULFILLMENT_STATUS_VARIANT } from
'../../../../components/ui/StatusBadge';
import { EmptyState } from '../../../../components/states/EmptyState';
import { useAdminOrders } from '../../../../context/OrderContext';
import { sampleUsers } from '../../../../data/sampleUsers';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useAdminOrders();
  const user = sampleUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <AdminLayout title="Customer Not Found">
        <EmptyState
          icon={<UserIcon className="h-8 w-8" />}
          title="Customer not found"
          description="No customer exists with that id." />

      </AdminLayout>);

  }

  const customerOrders = orders.filter(
    (o) => o.email?.toLowerCase() === user.email.toLowerCase()
  );

  return (
    <AdminLayout title={user.name}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-fit space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
          <div>
            <p className="text-xs text-ink-muted">Email</p>
            <p className="text-sm font-medium text-ink">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Phone</p>
            <p className="text-sm font-medium text-ink">{user.phone}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Joined</p>
            <p className="text-sm font-medium text-ink">{user.joinedDate}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Addresses</p>
            {user.addresses.length === 0 ?
            <p className="text-sm text-ink-muted">No saved addresses.</p> :

            <ul className="mt-1 space-y-2">
                {user.addresses.map((a) =>
              <li key={a.id} className="text-sm text-ink">
                    <span className="font-medium">{a.label}:</span> {a.line1},{' '}
                    {a.city}
                  </li>
              )}
              </ul>
            }
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display text-sm font-bold text-ink">
            Order History
          </h2>
          {customerOrders.length === 0 ?
          <EmptyState
            icon={<PackageSearchIcon className="h-8 w-8" />}
            title="No orders yet"
            description="This customer hasn't placed any orders." /> :


          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
              {customerOrders.map((order) =>
            <li key={order.id}>
                  <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface sm:p-5">

                    <div>
                      <p className="font-display text-sm font-bold text-ink">
                        #{order.id}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-ink">
                        PKR {PKR.format(order.total)}
                      </span>
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
        </div>
      </div>
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminCustomerDetail />
    </AdminProtectedRoute>);

}
