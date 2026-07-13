import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, ChevronRightIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { EmptyState } from '../../components/states/EmptyState';
import { useOrders } from '../../context/OrderContext';
import { sampleUsers } from '../../data/sampleUsers';

export function AdminCustomers() {
  const { orders } = useOrders();

  return (
    <AdminLayout title="Customers">
      {sampleUsers.length === 0 ?
      <EmptyState
        icon={<UsersIcon className="h-8 w-8" />}
        title="No customers yet"
        description="Registered customers will show up here." /> :


      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {sampleUsers.map((user) => {
            const orderCount = orders.filter(
              (o) => o.email?.toLowerCase() === user.email.toLowerCase()
            ).length;
            return (
              <li key={user.id}>
                <Link
                  to={`/admin/customers/${user.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-surface sm:p-5">

                  <div>
                    <p className="font-display text-sm font-bold text-ink">
                      {user.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {user.email} · {user.phone}
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
