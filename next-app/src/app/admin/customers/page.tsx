"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { UsersIcon, ChevronRightIcon } from 'lucide-react';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { EmptyState } from '../../../components/states/EmptyState';
import { useAdminOrders } from '../../../context/OrderContext';
import { useCustomers } from '../../../context/CustomerContext';

function AdminCustomers() {
  const { orders } = useAdminOrders();
  const { customers } = useCustomers();

  // Previously an O(customers x orders) scan inside the render map (a
  // filter() over every order, per customer row, on every render). One
  // pass over orders building a lookup map, then O(1) per customer.
  const orderCountByEmail = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders) {
      if (!o.email) continue;
      const key = o.email.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [orders]);

  return (
    <AdminLayout title="Customers">
      {customers.length === 0 ?
      <EmptyState
        icon={<UsersIcon className="h-8 w-8" />}
        title="No customers yet"
        description="Registered customers will show up here." /> :


      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {customers.map((user) => {
            const orderCount = orderCountByEmail.get(user.email.toLowerCase()) ?? 0;
            return (
              <li key={user.id}>
                <Link
                  href={`/admin/customers/${user.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-surface sm:p-5">

                  <div>
                    <p className="font-display text-sm font-bold text-ink">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-muted">
                      {orderCount} order{orderCount === 1 ? '' : 's'}
                    </span>
                    <span className="text-xs text-ink-muted">
                      Joined {user.joinedDate}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 text-ink-muted" />
                  </div>
                </Link>
              </li>);

          })}
        </ul>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminCustomers />
    </AdminProtectedRoute>);

}
