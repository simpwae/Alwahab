import React from 'react';
import { StarIcon } from 'lucide-react';
import { Review } from '../../types';
interface RatingBreakdownProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}
export function RatingBreakdown({
  reviews,
  averageRating,
  reviewCount
}: RatingBreakdownProps) {
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.rating) === star).length
  );
  const total = reviews.length || 1;
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex shrink-0 flex-col items-center sm:items-start">
        <span className="font-display text-4xl font-extrabold text-ink">
          {averageRating.toFixed(1)}
        </span>
        <div className="mt-1 flex items-center gap-0.5">
          {Array.from({
            length: 5
          }).map((_, i) =>
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />

          )}
        </div>
        <span className="mt-1 text-xs text-ink-muted">
          {reviewCount} reviews
        </span>
      </div>

      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star, idx) => {
          const pct = Math.round(counts[idx] / total * 100);
          return (
            <div key={star} className="flex items-center gap-2.5 text-xs">
              <span className="flex w-8 shrink-0 items-center gap-0.5 text-ink-muted">
                {star}{' '}
                <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{
                    width: `${pct}%`
                  }} />
                
              </div>
              <span className="w-9 shrink-0 text-right text-ink-muted">
                {pct}%
              </span>
            </div>);

        })}
      </div>
    </div>);

}