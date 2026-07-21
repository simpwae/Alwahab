"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  StarIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  ZapIcon,
  TruckIcon,
  RotateCcwIcon,
  WalletIcon,
  PackageXIcon } from
'lucide-react';
import { Header } from '../../../components/layout/Header';
import { TopUtilityBar } from '../../../components/layout/TopUtilityBar';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/CartDrawer';
import { Breadcrumb } from '../../../components/listing/Breadcrumb';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ImageGallery } from '../../../components/product/ImageGallery';
import { ProductTabs } from '../../../components/product/ProductTabs';
import { RelatedProducts } from '../../../components/product/RelatedProducts';
import { EmptyState } from '../../../components/states/EmptyState';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductContext';
import { useReviews } from '../../../context/ReviewContext';
import { categoryToSlug } from '../../../utils/productFilters';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { reviews: allReviews } = useReviews();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const product = useMemo(() => products.find((p) => p.id === id), [id, products]);
  const reviews = useMemo(
    () => allReviews.filter((r) => r.productId === id),
    [id, allReviews]
  );
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.
    filter(
      (p) =>
      p.id !== product.id && (
      p.category === product.category || p.brand === product.brand)
    ).
    slice(0, 8);
  }, [product, products]);
  // Mock gating: in a real app this would check the user's order history for a delivered order of this product.
  const hasPurchased = false;
  if (!product) {
    return (
      <div className="min-h-full w-full bg-white">
        <TopUtilityBar />
        <Header />
        <CartDrawer />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <EmptyState
            icon={<PackageXIcon className="h-8 w-8" />}
            title="Product not found"
            description="The product you're looking for may have been removed or is no longer available."
            actionLabel="Back to Home"
            onAction={() => {
              window.location.href = '/';
            }} />

        </main>
        <Footer />
      </div>);

  }
  const isOutOfStock = product.status === 'OutOfStock' || product.stockQty === 0;
  const sizeRequired = product.sizes.length > 0 && !selectedSize;
  const isLowStock =
  !isOutOfStock && product.stockQty <= product.lowStockThreshold;
  const displayedPrice = selectedSize ?
  product.sizes.find((s) => s.label === selectedSize)?.price ?? product.sellingPrice :
  product.sellingPrice;
  const hasDiscount = product.originalPrice > displayedPrice;
  const discountPct = hasDiscount ?
  Math.round((product.originalPrice - displayedPrice) / product.originalPrice * 100) :
  0;
  const savings = product.originalPrice - displayedPrice;
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb
          items={[
          {
            label: product.category,
            href: `/category/${categoryToSlug(product.category)}`
          },
          {
            label: product.name
          }]
          } />


        <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ImageGallery images={product.images} productName={product.name} />

          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {product.category} · {product.brand}
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-bold text-ink sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({
                  length: 5
                }).map((_, i) =>
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />

                )}
              </div>
              <span className="text-sm font-medium text-ink">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-ink-muted">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-surface p-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-ink">
                  PKR {PKR.format(displayedPrice)}
                </span>
                {hasDiscount &&
                <span className="text-base text-ink-muted line-through">
                    PKR {PKR.format(product.originalPrice)}
                  </span>
                }
                {hasDiscount &&
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                    -{discountPct}%
                  </span>
                }
              </div>
              {hasDiscount &&
              <p className="mt-1 text-sm font-medium text-primary">
                  You save PKR {PKR.format(savings)} ({discountPct}%)
                </p>
              }
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {isOutOfStock ?
                <StatusBadge label="Out of Stock" variant="danger" /> :
                isLowStock ?
                <span className="text-sm font-semibold text-accent-dark">
                    Only {product.stockQty} left in stock
                  </span> :

                <StatusBadge label="In Stock" variant="success" />
                }
                {product.unitsSold > 0 &&
                <span className="text-sm text-ink-muted">
                    {product.unitsSold} sold
                  </span>
                }
              </div>
            </div>

            {!isOutOfStock && product.sizes.length > 0 &&
            <div className="mt-5">
                <span className="text-sm font-medium text-ink">Size</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) =>
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${selectedSize === size.label ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 text-ink hover:border-primary'}`}>

                      {size.label}
                      {size.price !== product.sellingPrice &&
                    <span className="ml-1 text-xs text-ink-muted">
                          (PKR {PKR.format(size.price)})
                        </span>
                    }
                    </button>
                )}
                </div>
              </div>
            }

            {!isOutOfStock &&
            <div className="mt-5 flex items-center gap-3">
                <span className="text-sm font-medium text-ink">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink">

                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">
                    {qty}
                  </span>
                  <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                  setQty((q) => Math.min(product.stockQty, q + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink">

                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            }

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                disabled={isOutOfStock || sizeRequired}
                icon={<ShoppingCartIcon className="h-4 w-4" />}
                onClick={() => addToCart(product, qty, selectedSize)}>

                {isOutOfStock ? 'Out of Stock' : sizeRequired ? 'Select a Size' : 'Add to Cart'}
              </Button>
              <Link
                href={isOutOfStock || sizeRequired ? '#' : '/checkout'}
                aria-disabled={isOutOfStock || sizeRequired}
                onClick={(e) => {
                  if (isOutOfStock || sizeRequired) {
                    e.preventDefault();
                    return;
                  }
                  addToCart(product, qty, selectedSize);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors sm:w-full ${isOutOfStock || sizeRequired ? 'pointer-events-none bg-gray-200 text-ink-muted' : 'bg-accent hover:bg-accent-dark'}`}>

                <ZapIcon className="h-4 w-4" />
                Buy Now
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 p-4 sm:grid-cols-3">
              <div className="flex items-center gap-2.5">
                <TruckIcon className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-ink">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-ink-muted">2–4 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <WalletIcon className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-ink">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-ink-muted">Available nationwide</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcwIcon className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-ink">
                    7-Day Returns
                  </p>
                  <p className="text-xs text-ink-muted">Easy & hassle-free</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ProductTabs
            product={product}
            reviews={reviews}
            canReview={hasPurchased} />

        </div>

        <div className="mt-12">
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>

      <Footer />
    </div>);

}
