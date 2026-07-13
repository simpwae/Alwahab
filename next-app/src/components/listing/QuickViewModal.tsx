"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  XIcon,
  StarIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon } from
'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}
export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const isOutOfStock = product ?
  product.status === 'OutOfStock' || product.stockQty === 0 :
  false;
  const handleClose = () => {
    setQty(1);
    setActiveImage(0);
    onClose();
  };
  return (
    <AnimatePresence>
      {product &&
      <>
          <motion.div
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={handleClose}
          aria-hidden="true" />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 12
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 12
            }}
            transition={{
              duration: 0.2
            }}
            className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-2xl bg-white shadow-2xl sm:grid-cols-2">

              <button
              type="button"
              onClick={handleClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-muted shadow-sm hover:text-ink">

                <XIcon className="h-5 w-5" />
              </button>

              <div className="bg-surface p-5">
                <div className="aspect-square overflow-hidden rounded-xl bg-white">
                  <img
                  src={product.images[activeImage] ?? product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover" />

                </div>
                {product.images.length > 1 &&
              <div className="mt-3 flex gap-2">
                    {product.images.map((img, i) =>
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${activeImage === i ? 'border-primary' : 'border-transparent'}`}>

                        <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover" />

                      </button>
                )}
                  </div>
              }
              </div>

              <div className="flex flex-col p-5 sm:p-6">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  {product.category} · {product.brand}
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-center gap-1.5">
                  <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-ink">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-ink-muted">
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink">
                    PKR {PKR.format(product.sellingPrice)}
                  </span>
                  {product.discountPct > 0 &&
                <span className="text-sm text-ink-muted line-through">
                      PKR {PKR.format(product.originalPrice)}
                    </span>
                }
                </div>

                <div className="mt-2">
                  {isOutOfStock ?
                <StatusBadge label="Out of Stock" variant="danger" /> :
                product.stockQty <= product.lowStockThreshold ?
                <span className="text-sm font-medium text-accent-dark">
                      Only {product.stockQty} left in stock
                    </span> :

                <StatusBadge label="In Stock" variant="success" />
                }
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-ink-muted">
                  {product.description}
                </p>

                {!isOutOfStock &&
              <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-gray-200">
                      <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink">

                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
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

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isOutOfStock}
                  icon={<ShoppingCartIcon className="h-4 w-4" />}
                  onClick={() => {
                    addToCart(product, qty);
                    handleClose();
                  }}>

                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Link
                  href={`/product/${product.id}`}
                  onClick={handleClose}
                  className="flex shrink-0 items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary">

                    View Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}
