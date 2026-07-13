import React from 'react';
import { Link } from 'react-router-dom';
import { TagIcon, PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { Button } from '../../components/ui/Button';
import { useCoupons } from '../../context/CouponContext';
import { Coupon } from '../../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const STATUS_VARIANT: Record<Coupon['status'], 'success' | 'danger' | 'info'> = {
  Active: 'success',
  Expired: 'danger',
  Scheduled: 'info'
};

export function AdminCoupons() {
  const { coupons, deleteCoupon } = useCoupons();

  const handleDelete = (code: string) => {
    if (!window.confirm(`Delete coupon "${code}"? This can't be undone.`)) return;
    deleteCoupon(code);
    toast.success('Coupon deleted');
  };

  return (
    <AdminLayout title="Coupons">
      <div className="mb-4 flex justify-end">
        <Link to="/admin/coupons/new">
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
              {coupons.map((c) =>
            <tr key={c.code}>
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
                    to={`/admin/coupons/${c.code}/edit`}
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
        </div>
      }
    </AdminLayout>);

}
