import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../states/Skeleton';
import { EmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';
import { useWishlist } from '../../context/WishlistContext';
interface ProductSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  viewAllHref?: string;
  products: Product[];
  status?: 'idle' | 'loading' | 'error' | 'empty';
  onRetry?: () => void;
}
export function ProductSection({
  title,
  subtitle,
  icon,
  viewAllHref,
  products,
  status = 'idle',
  onRetry
}: ProductSectionProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  return (
    <section aria-label={title}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon &&
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
              {icon}
            </span>
          }
          <div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
          </div>
        </div>
        {viewAllHref &&
        <Link
          to={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark">
          
            View All
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        }
      </div>

      {status === 'loading' && <ProductGridSkeleton count={8} />}

      {status === 'error' && <ErrorState onRetry={onRetry} />}

      {status === 'empty' &&
      <EmptyState
        title="No products to show"
        description="Check back soon — new products are added regularly." />

      }

      {status === 'idle' &&
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) =>
        <ProductCard
          key={product.id}
          product={product}
          wishlisted={isWishlisted(product.id)}
          onToggleWishlist={toggleWishlist} />

        )}
        </div>
      }
    </section>);

}