"use client";

import React from 'react';
import { SearchXIcon } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../states/Skeleton';
import { EmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { useWishlist } from '../../context/WishlistContext';
interface ProductGridProps {
  products: Product[];
  status?: 'idle' | 'loading' | 'error' | 'empty';
  onRetry?: () => void;
  onQuickView?: (product: Product) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}
export function ProductGrid({
  products,
  status = 'idle',
  onRetry,
  onQuickView,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or search terms to find what you are looking for.',
  emptyAction
}: ProductGridProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  if (status === 'loading') return <ProductGridSkeleton count={8} />;
  if (status === 'error') return <ErrorState onRetry={onRetry} />;
  if (status === 'empty' || products.length === 0) {
    return (
      <EmptyState
        icon={<SearchXIcon className="h-8 w-8" />}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyAction?.label}
        onAction={emptyAction?.onClick} />);


  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) =>
      <ProductCard
        key={product.id}
        product={product}
        wishlisted={isWishlisted(product.id)}
        onToggleWishlist={toggleWishlist}
        onQuickView={onQuickView} />

      )}
    </div>);

}
