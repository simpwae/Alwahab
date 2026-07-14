"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { TagIcon, PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/states/EmptyState';
import { Button } from '../../../components/ui/Button';
import { useCoupons } from '../../../context/CouponContext';
import { useAdminOrders } from '../../../context/OrderContext';
import { Coupon } from '../../../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const PAGE_SIZE = 8;
const STATUS_VARIANT: Record<Coupon['status'], 'success' | 'danger' | 'info'> = {
  Active: 'success',
  Expired: 'danger',
  Scheduled: 'info'
};

function AdminCoupons() {
  const { coupons, deleteCoupon, deleteCoupons } = useCoupons();
  const { orders } = useAdminOrders();
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const referencedCodes = useMemo(
    () => new Set(orders.map((o) => o.couponCode).filter((c): c is string => Boolean(c))),
    [orders]
  );

  const visible = coupons.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < coupons.length;
  const allVisibleSelected = visible.length > 0 && visible.every((c) => selectedCodes.includes(c.code));

  const toggleSelected = (code: string) => {
    setSelectedCodes((prev) => prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]);
  };
  const toggleSelectAllVisible = () => {
    setSelectedCodes((prev) =>
    allVisibleSelected ?
    prev.filter((code) => !visible.some((c) => c.code === code)) :
    [...new Set([...prev, ...visible.map((c) => c.code)])]
    );
  };

  const handleDelete = async (code: string) => {
    if (referencedCodes.has(code)) {
      toast.error(`Can't delete "${code}" — it's referenced by an existing order.`);
      return;
    }
    if (!window.confirm(`Delete coupon "${code}"? This can't be undone.`)) return;
    const error = await deleteCoupon(code);
    if (error) toast.error(error);
    else toast.success('Coupon deleted');
  };

  const handleBulkDelete = async () => {
    const blocked = selectedCodes.filter((code) => referencedCodes.has(code));
    const deletable = selectedCodes.filter((code) => !referencedCodes.has(code));
    if (deletable.length === 0) {
      toast.error('All selected coupons are referenced by existing orders and can\'t be deleted.');
      return;
    }
    if (!window.confirm(`Delete ${deletable.length} coupon${deletable.length > 1 ? 's' : ''}? This can't be undone.`)) return;
    const error = await deleteCoupons(deletable);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedCodes([]);
    if (blocked.length > 0) {
      toast.warning(`${deletable.length} deleted, ${blocked.length} skipped — referenced by existing orders.`);
    } else {
      toast.success(`${deletable.length} coupon${deletable.length > 1 ? 's' : ''} deleted`);
    }
  };

  return (
    <AdminLayout title="Coupons">
      <div className="mb-4 flex items-center justify-between gap-3">
        {selectedCodes.length > 0 ?
        <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-muted">{selectedCodes.length} selected</span>
            <button
            type="button"
            onClick={handleBulkDelete}
            className="rounded-lg px-3 py-1.5 font-medium text-red-600 hover:bg-red-50">

              Delete Selected
            </button>
          </div> :

        <span />
        }
        <Link href="/admin/coupons/new">
          <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
            Add Coupon
          </Button>
        </Link>
      </div>

      {coupons.length === 0 ?
      <EmptyState
        icon={<TagIcon className="h-8 w-8" />}
        title="No coupons yet"
        description="Add your first coupon to offer discounts at checkout." /> :


      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-ink-muted">
                <th className="px-4 py-3">
                  <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

                </th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Min Order</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Usage Limit</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Valid Until</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((c) =>
            <tr key={c.code}>
                  <td className="px-4 py-3">
                    <input
                    type="checkbox"
                    aria-label={`Select ${c.code}`}
                    checked={selectedCodes.includes(c.code)}
                    onChange={() => toggleSelected(c.code)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-display font-bold text-ink">
                    {c.code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink">
                    {c.type === '%' ? `${c.value}%` : `PKR ${PKR.format(c.value)}`}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-ink-muted sm:table-cell">
                    PKR {PKR.format(c.minOrder)}
                  </td>
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">
                    {c.usageLimit}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-ink-muted sm:table-cell">
                    {c.validTo}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <StatusBadge label={c.status} variant={STATUS_VARIANT[c.status]} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                    href={`/admin/coupons/${c.code}/edit`}
                    aria-label={`Edit ${c.code}`}
                    className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-primary">

                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                    type="button"
                    aria-label={`Delete ${c.code}`}
                    onClick={() => handleDelete(c.code)}
                    className="rounded-lg p-2 text-ink-muted hover:bg-red-50 hover:text-red-600">

                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
          {hasMore &&
        <div className="flex justify-center border-t border-gray-100 p-4">
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                Load More
              </Button>
            </div>
        }
        </div>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminCoupons />
    </AdminProtectedRoute>);

}
