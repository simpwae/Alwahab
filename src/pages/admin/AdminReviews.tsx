import React from 'react';
import { StarIcon, MessageSquareIcon, CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { Button } from '../../components/ui/Button';
import { useReviews } from '../../context/ReviewContext';
import { useProducts } from '../../context/ProductContext';
import { ReviewStatus } from '../../types';

const STATUS_VARIANT: Record<ReviewStatus, 'success' | 'warning' | 'danger'> = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger'
};

export function AdminReviews() {
  const { reviews, updateReview } = useReviews();
  const { products } = useProducts();

  const handleStatusChange = (id: string, status: ReviewStatus) => {
    updateReview(id, { status });
    toast.success(`Review ${status.toLowerCase()}`);
  };

  return (
    <AdminLayout title="Reviews">
      {reviews.length === 0 ?
      <EmptyState
        icon={<MessageSquareIcon className="h-8 w-8" />}
        title="No reviews yet"
        description="Customer reviews will show up here for moderation." /> :


      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {reviews.map((r) => {
            const product = products.find((p) => p.id === r.productId);
            return (
              <li key={r.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-ink-muted">
                      {product?.name ?? r.productId}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm font-bold text-ink">{r.customer}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) =>
                        <StarIcon
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />

                        )}
                      </div>
                    </div>
                    {r.title &&
                    <p className="mt-1 text-sm font-medium text-ink">{r.title}</p>
                    }
                    <p className="mt-1 max-w-2xl text-sm text-ink-muted">
                      {r.comment}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{r.date}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge label={r.status} variant={STATUS_VARIANT[r.status]} />
                    {r.status !== 'Approved' &&
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<CheckIcon className="h-3.5 w-3.5" />}
                      onClick={() => handleStatusChange(r.id, 'Approved')}>

                        Approve
                      </Button>
                    }
                    {r.status !== 'Rejected' &&
                    <Button
                      size="sm"
                      variant="danger-ghost"
                      icon={<XIcon className="h-3.5 w-3.5" />}
                      onClick={() => handleStatusChange(r.id, 'Rejected')}>

                        Reject
                      </Button>
                    }
                  </div>
                </div>
              </li>);

          })}
        </ul>
      }
    </AdminLayout>);

}
