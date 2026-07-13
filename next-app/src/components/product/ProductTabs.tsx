"use client";

import React, { useState } from 'react';
import { StarIcon, BadgeCheckIcon, LockIcon } from 'lucide-react';
import { Product, Review } from '../../types';
import { RatingBreakdown } from './RatingBreakdown';
import { Button } from '../ui/Button';
import { EmptyState } from '../states/EmptyState';
type TabId = 'description' | 'specifications' | 'reviews';
interface ProductTabsProps {
  product: Product;
  reviews: Review[];
  canReview: boolean;
}
const TABS: {
  id: TabId;
  label: string;
}[] = [
{
  id: 'description',
  label: 'Description'
},
{
  id: 'specifications',
  label: 'Specifications'
},
{
  id: 'reviews',
  label: 'Reviews'
}];

export function ProductTabs({ product, reviews, canReview }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const approvedReviews = reviews.filter((r) => r.status === 'Approved');
  return (
    <div className="rounded-2xl border border-gray-100 bg-white">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex border-b border-gray-100">

        {TABS.map((tab) =>
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex-1 px-4 py-3.5 text-sm font-medium transition-colors sm:flex-none sm:px-6 ${activeTab === tab.id ? 'text-primary' : 'text-ink-muted hover:text-ink'}`}>

            {tab.label}
            {tab.id === 'reviews' && ` (${approvedReviews.length})`}
            {activeTab === tab.id &&
          <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
          }
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'description' &&
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-ink-muted">
              {product.description}
            </p>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.specs.map((spec) =>
              <li
                key={spec}
                className="flex items-start gap-2 text-sm text-ink-muted">

                    <BadgeCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {spec}
                  </li>
              )}
              </ul>
            </div>
          </div>
        }

        {activeTab === 'specifications' &&
        <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="w-1/3 py-2.5 pr-4 font-medium text-ink">SKU</td>
                <td className="py-2.5 text-ink-muted">{product.sku}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-medium text-ink">Brand</td>
                <td className="py-2.5 text-ink-muted">{product.brand}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-medium text-ink">Category</td>
                <td className="py-2.5 text-ink-muted">{product.category}</td>
              </tr>
              {product.specs.map((spec) => {
              const [label, ...rest] = spec.split(':');
              return (
                <tr
                  key={spec}
                  className="border-b border-gray-100 last:border-b-0">

                    <td className="py-2.5 pr-4 font-medium text-ink">
                      {rest.length ? label : 'Feature'}
                    </td>
                    <td className="py-2.5 text-ink-muted">
                      {rest.length ? rest.join(':').trim() : spec}
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        }

        {activeTab === 'reviews' &&
        <div className="space-y-6">
            <RatingBreakdown
            reviews={approvedReviews}
            averageRating={product.rating}
            reviewCount={product.reviewCount} />


            <div className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3">
              <p className="text-xs text-ink-muted sm:text-sm">
                {canReview ?
              'Share your experience with this product.' :
              'Only customers who purchased this product can leave a review.'}
              </p>
              <Button
              variant={canReview ? 'primary' : 'secondary'}
              size="sm"
              disabled={!canReview}
              icon={
              !canReview ? <LockIcon className="h-3.5 w-3.5" /> : undefined
              }>

                Write a Review
              </Button>
            </div>

            {approvedReviews.length === 0 ?
          <EmptyState
            title="No reviews yet"
            description="Be the first to review this product once you've received your order." /> :


          <ul className="space-y-5">
                {approvedReviews.map((review) =>
            <li
              key={review.id}
              className="border-b border-gray-100 pb-5 last:border-b-0">

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">
                          {review.customer}
                        </span>
                        {review.verifiedPurchase &&
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                            <BadgeCheckIcon className="h-3.5 w-3.5" />
                            Verified Purchase
                          </span>
                  }
                      </div>
                      <span className="text-xs text-ink-muted">
                        {review.date}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-0.5">
                      {Array.from({
                  length: 5
                }).map((_, i) =>
                <StarIcon
                  key={i}
                  className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />

                )}
                    </div>
                    {review.title &&
              <h4 className="mt-1.5 text-sm font-semibold text-ink">
                        {review.title}
                      </h4>
              }
                    <p className="mt-1 text-sm text-ink-muted">
                      {review.comment}
                    </p>
                  </li>
            )}
              </ul>
          }
          </div>
        }
      </div>
    </div>);

}
