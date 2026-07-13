import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearchIcon, ChevronRightIcon } from 'lucide-react';
import { AccountLayout } from '../components/account/AccountLayout';
import { StatusBadge, FULFILLMENT_STATUS_VARIANT } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/states/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

export function AccountOrders() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const myOrders = orders.filter(
    (o) => o.email?.toLowerCase() === user?.email.toLowerCase()
  );

  return (
    <AccountLayout
      title="My Orders"
      breadcrumb={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]}>

      {myOrders.length === 0 ?
      <EmptyState
        icon={<PackageSearchIcon className="h-8 w-8" />}
        title="No orders yet"
        description="Your past orders will show up here once you place one." /> :


      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
          {myOrders.map((order) =>
        <li key={order.id}>
              <Link
            to={`/account/orders/${order.id}`}
            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface sm:p-5">

                <div>
                  <p className="font-display text-sm font-bold text-ink">
                    #{order.id}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {order.date} · {order.items.length} item
                    {order.items.length === 1 ? '' : 's'}
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
    </AccountLayout>);

}
