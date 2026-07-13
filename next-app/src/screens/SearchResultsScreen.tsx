"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontalIcon, SearchXIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Breadcrumb } from '../components/listing/Breadcrumb';
import {
  FilterSidebar,
  FilterSidebarMobileSheet } from
'../components/listing/FilterSidebar';
import { SortDropdown } from '../components/listing/SortDropdown';
import { ActiveFilterChips } from '../components/listing/ActiveFilterChips';
import { ProductGrid } from '../components/listing/ProductGrid';
import { QuickViewModal } from '../components/listing/QuickViewModal';
import { Button } from '../components/ui/Button';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import {
  ListingFilters,
  SortOption,
  createDefaultFilters } from
'../components/listing/types';
import {
  applyFilters,
  applySort,
  categoryToSlug } from
'../utils/productFilters';
const PAGE_SIZE = 8;
const POPULAR_CATEGORIES = [
'Electronics',
'Accessories',
'Home & Kitchen',
'Gadgets',
'Lifestyle'];

export function SearchResultsScreen() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const [status, setStatus] = useState<'loading' | 'idle'>('loading');
  const [filters, setFilters] = useState<ListingFilters>(createDefaultFilters());
  const [sort, setSort] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const matched = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [query, products]);
  useEffect(() => {
    setStatus('loading');
    setFilters(createDefaultFilters());
    setPage(1);
    const timer = setTimeout(() => setStatus('idle'), 400);
    return () => clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(
    () => applyFilters(matched, filters),
    [matched, filters]
  );
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const visible = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < sorted.length;
  const suggestedProducts = useMemo(
    () => [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4),
    [products]
  );
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)} />


      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb
          items={[
          {
            label: 'Search Results'
          }]
          } />


        <div className="mt-4">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {query ?
            <>
                Results for &ldquo;{query}&rdquo;{' '}
                {status === 'idle' &&
              <span className="text-ink-muted">({matched.length})</span>
              }
              </> :

            'Search'
            }
          </h1>
        </div>

        {!query ?
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-surface px-6 py-14 text-center">
            <SearchXIcon className="mb-4 h-10 w-10 text-ink-muted" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Start typing to search
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
              Use the search bar above to find products across electronics,
              accessories, home &amp; kitchen, gadgets, and lifestyle.
            </p>
          </div> :
        matched.length === 0 && status === 'idle' ?
        <div className="mt-10">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-surface px-6 py-14 text-center">
              <SearchXIcon className="mb-4 h-10 w-10 text-ink-muted" />
              <h2 className="font-display text-lg font-semibold text-ink">
                No results for &ldquo;{query}&rdquo;
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
                Try checking your spelling, using fewer or more general
                keywords, or explore a popular category below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {POPULAR_CATEGORIES.map((cat) =>
              <Link
                key={cat}
                href={`/category/${categoryToSlug(cat)}`}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary">

                    {cat}
                  </Link>
              )}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 font-display text-lg font-bold text-ink">
                You might like
              </h3>
              <ProductGrid
              products={suggestedProducts}
              onQuickView={setQuickViewProduct} />

            </div>
          </div> :

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <FilterSidebar
            allProducts={matched}
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
            onClearAll={() => setFilters(createDefaultFilters())}
            className="hidden w-72 shrink-0 lg:block" />


            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">
                  {status === 'idle' ?
                <>
                      <span className="font-medium text-ink">
                        {sorted.length}
                      </span>{' '}
                      result{sorted.length !== 1 ? 's' : ''}
                    </> :

                'Loading results…'
                }
                </p>
                <div className="flex items-center gap-2">
                  <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-ink lg:hidden">

                    <SlidersHorizontalIcon className="h-4 w-4" />
                    Filters
                  </button>
                  <SortDropdown value={sort} onChange={setSort} />
                </div>
              </div>

              <div className="mb-4">
                <ActiveFilterChips filters={filters} onChange={setFilters} />
              </div>

              <ProductGrid
              products={visible}
              status={status === 'loading' ? 'loading' : 'idle'}
              onQuickView={setQuickViewProduct}
              emptyAction={{
                label: 'Clear Filters',
                onClick: () => setFilters(createDefaultFilters())
              }} />


              {status === 'idle' && hasMore &&
            <div className="mt-8 flex justify-center">
                  <Button
                variant="secondary"
                size="lg"
                onClick={() => setPage((p) => p + 1)}>

                    Load More Products
                  </Button>
                </div>
            }
            </div>

            <FilterSidebarMobileSheet
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            allProducts={matched}
            filters={filters}
            onChange={setFilters}
            onClearAll={() => setFilters(createDefaultFilters())} />


          </div>
        }
      </main>

      <Footer />
    </div>);

}
