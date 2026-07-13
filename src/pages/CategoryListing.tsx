import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontalIcon } from 'lucide-react';
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
import { SeoText } from '../components/listing/SeoText';
import { Button } from '../components/ui/Button';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import {
  ListingFilters,
  SortOption,
  createDefaultFilters,
  DEFAULT_MAX_PRICE } from
'../components/listing/types';
import {
  applyFilters,
  applySort,
  slugToCategory } from
'../utils/productFilters';
const PAGE_SIZE = 8;
const CATEGORY_SEO: Record<
  string,
  {
    title: string;
    paragraphs: string[];
  }> =
{
  electronics: {
    title: 'Shop Electronics Online at Alwahab',
    paragraphs: [
    'Discover the latest in consumer electronics at Alwahab — from noise-cancelling headphones to portable Bluetooth speakers. We source only genuine, authentic products from trusted brands, backed by our 7-day return policy.',
    'Whether you are looking for daily-use accessories or the newest tech gadgets, our electronics collection is updated regularly with new arrivals and flash deals. Enjoy fast nationwide delivery and cash on delivery on eligible orders.']

  },
  deals: {
    title: 'Best Deals & Discounts at Alwahab',
    paragraphs: [
    "Explore Alwahab's biggest discounts across electronics, accessories, home & kitchen, gadgets, and lifestyle categories. Deals are updated frequently, so check back often to avoid missing out.",
    'All discounted items are 100% genuine and covered by our standard return policy. Pay via Cash on Delivery, bank transfer, or card at checkout.']

  },
  default: {
    title: 'Shop at Alwahab',
    paragraphs: [
    'Alwahab brings you a curated multi-category shopping experience spanning electronics, accessories, home & kitchen, gadgets, and lifestyle products — all in one trusted store.',
    'Every product is quality-checked before listing, and we offer nationwide delivery with cash on delivery, secure bank transfer, and card payment options.']

  }
};
export function CategoryListing() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  const isDeals = slug === 'deals';
  const categoryName =
  slug && !isDeals && slug !== 'all' ? slugToCategory(slug) : null;
  const baseProducts = useMemo(() => {
    if (isDeals) return products.filter((p) => p.discountPct > 0);
    if (categoryName)
    return products.filter((p) => p.category === categoryName);
    return products;
  }, [isDeals, categoryName, products]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [filters, setFilters] = useState<ListingFilters>(createDefaultFilters());
  const [sort, setSort] = useState<SortOption>(
    searchParams.get('sort') as SortOption || 'featured'
  );
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  useEffect(() => {
    setStatus('loading');
    setFilters(createDefaultFilters());
    setPage(1);
    const timer = setTimeout(() => setStatus('idle'), 450);
    return () => clearTimeout(timer);
  }, [slug]);
  const filtered = useMemo(
    () => applyFilters(baseProducts, filters),
    [baseProducts, filters]
  );
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const visible = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < sorted.length;
  const pageTitle = isDeals ? 'Deals' : categoryName ?? 'All Products';
  const seo = CATEGORY_SEO[slug ?? 'default'] ?? CATEGORY_SEO.default;
  const handleSortChange = (next: SortOption) => {
    setSort(next);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('sort', next);
      return params;
    });
  };
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
            label: 'Shop',
            href: '/category/all'
          },
          {
            label: pageTitle
          }]
          } />
        

        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {pageTitle}
          </h1>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <FilterSidebar
            allProducts={baseProducts}
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
                <SortDropdown value={sort} onChange={handleSortChange} />
              </div>
            </div>

            <div className="mb-4">
              <ActiveFilterChips filters={filters} onChange={setFilters} />
            </div>

            <ProductGrid
              products={visible}
              status={
              status === 'loading' ?
              'loading' :
              sorted.length === 0 ?
              'empty' :
              'idle'
              }
              onRetry={() => setStatus('idle')}
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
        </div>

        <div className="mt-12">
          <SeoText title={seo.title} paragraphs={seo.paragraphs} />
        </div>
      </main>

      <FilterSidebarMobileSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        allProducts={baseProducts}
        filters={filters}
        onChange={setFilters}
        onClearAll={() => setFilters(createDefaultFilters())} />
      

      <Footer />
    </div>);

}