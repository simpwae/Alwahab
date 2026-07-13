"use client";

import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { useWishlist } from '../../context/WishlistContext';
interface RelatedProductsProps {
  products: Product[];
}
export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();
  if (products.length === 0) return null;
  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({
      left: dir * 320,
      behavior: 'smooth'
    });
  };
  return (
    <section aria-label="You may also like">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            You May Also Like
          </h2>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-muted hover:border-primary hover:text-primary">

            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-muted hover:border-primary hover:text-primary">

            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {products.map((product) =>
        <div
          key={product.id}
          className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]">

            <ProductCard
            product={product}
            wishlisted={isWishlisted(product.id)}
            onToggleWishlist={toggleWishlist} />

          </div>
        )}
      </div>
    </section>);

}
