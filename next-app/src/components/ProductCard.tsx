"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartIcon, ShoppingCartIcon, StarIcon, EyeIcon } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { StatusBadge } from './ui/StatusBadge';
interface ProductCardProps {
  product: Product;
  wishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onQuickView?: (product: Product) => void;
}
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
export function ProductCard({
  product,
  wishlisted = false,
  onToggleWishlist,
  onQuickView
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const isOutOfStock = product.status === 'OutOfStock' || product.stockQty === 0;
  const isLowStock =
  !isOutOfStock && product.stockQty <= product.lowStockThreshold;
  const secondImage = product.images[1] ?? product.images[0];
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition-shadow hover:shadow-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-surface"
        aria-label={product.name}>

        <img
          src={hovered ? secondImage : product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-opacity duration-200"
          loading="lazy" />

        {product.discountPct > 0 &&
        <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2 py-1 text-xs font-bold text-white shadow-sm">
            -{product.discountPct}%
          </span>
        }
        {product.ribbon !== 'none' &&
        <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            {product.ribbon === 'BestSeller' ? 'Best Seller' : 'New'}
          </span>
        }
        {isOutOfStock &&
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <StatusBadge label="Out of Stock" variant="danger" />
          </div>
        }
        {onQuickView &&
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center gap-1.5 rounded-xl bg-ink/85 py-2 text-xs font-medium text-white opacity-0 backdrop-blur transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-3 sm:bottom-3">

            <EyeIcon className="h-3.5 w-3.5" />
            Quick View
          </button>
        }
      </Link>

      <button
        type="button"
        onClick={() => onToggleWishlist?.(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={wishlisted}
        className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-muted shadow-sm transition-colors hover:text-accent focus-visible:text-accent"
        style={{
          top: product.ribbon !== 'none' ? '2.9rem' : '0.625rem'
        }}>

        <HeartIcon
          className={`h-4 w-4 ${wishlisted ? 'fill-accent text-accent' : ''}`} />

      </button>

      <div className="flex flex-1 flex-col p-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          {product.category} · {product.brand}
        </span>
        <Link
          href={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-sm font-medium text-ink hover:text-primary focus-visible:text-primary">

          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-ink">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-ink-muted">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-base font-bold text-ink">
            PKR {PKR.format(product.sellingPrice)}
          </span>
          {product.discountPct > 0 &&
          <span className="text-xs text-ink-muted line-through">
              PKR {PKR.format(product.originalPrice)}
            </span>
          }
        </div>

        <div className="mt-1 h-4 text-xs">
          {isLowStock ?
          <span className="font-medium text-accent-dark">
              Only {product.stockQty} left
            </span> :
          product.unitsSold > 0 ?
          <span className="text-ink-muted">{product.unitsSold} sold</span> :
          null}
        </div>

        {product.sizes.length > 0 ?
        <Link
          href={`/product/${product.id}`}
          aria-disabled={isOutOfStock}
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isOutOfStock ? 'pointer-events-none bg-gray-200 text-ink-muted' : 'bg-primary text-white hover:bg-primary-dark'}`}>

            <ShoppingCartIcon className="h-4 w-4" />
            {isOutOfStock ? 'Out of Stock' : 'Select Size'}
          </Link> :

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(product)}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-ink-muted">

            <ShoppingCartIcon className="h-4 w-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        }
      </div>
    </div>);

}
