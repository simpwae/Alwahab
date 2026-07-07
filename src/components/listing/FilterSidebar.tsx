import React from 'react';
import { XIcon, StarIcon } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { ListingFilters, DEFAULT_MAX_PRICE } from './types';
interface FacetCount {
  value: string;
  count: number;
}
interface FilterSidebarProps {
  allProducts: Product[];
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onClearAll: () => void;
  className?: string;
}
function getFacetCounts(
products: Product[],
key: 'category' | 'brand')
: FacetCount[] {
  const counts = new Map<string, number>();
  products.forEach((p) => {
    counts.set(p[key], (counts.get(p[key]) ?? 0) + 1);
  });
  return Array.from(counts.entries()).
  map(([value, count]) => ({
    value,
    count
  })).
  sort((a, b) => a.value.localeCompare(b.value));
}
function FilterSection({
  title,
  children



}: {title: string;children: React.ReactNode;}) {
  return (
    <div className="border-b border-gray-100 py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>);

}
export function FilterSidebar({
  allProducts,
  filters,
  onChange,
  onClearAll,
  className = ''
}: FilterSidebarProps) {
  const categoryFacets = getFacetCounts(allProducts, 'category');
  const brandFacets = getFacetCounts(allProducts, 'brand');
  const inStockCount = allProducts.filter(
    (p) => p.stockQty > 0 && p.status !== 'OutOfStock'
  ).length;
  const toggleArrayValue = (key: 'categories' | 'brands', value: string) => {
    const current = filters[key];
    const next = current.includes(value) ?
    current.filter((v) => v !== value) :
    [...current, value];
    onChange({
      ...filters,
      [key]: next
    });
  };
  const hasActiveFilters =
  filters.categories.length > 0 ||
  filters.brands.length > 0 ||
  filters.minRating !== null ||
  filters.minDiscount !== null ||
  filters.inStockOnly ||
  filters.maxPrice < DEFAULT_MAX_PRICE;
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 ${className}`}>
      
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-ink">Filters</h2>
        {hasActiveFilters &&
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-primary hover:text-primary-dark">
          
            Clear all
          </button>
        }
      </div>

      <FilterSection title="Price">
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={DEFAULT_MAX_PRICE}
            step={500}
            value={filters.maxPrice}
            onChange={(e) =>
            onChange({
              ...filters,
              maxPrice: Number(e.target.value)
            })
            }
            aria-label="Maximum price"
            className="w-full accent-primary" />
          
          <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
            <span>PKR 0</span>
            <span className="font-medium text-ink">
              Up to PKR {filters.maxPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <ul className="space-y-2.5">
          {categoryFacets.map((facet) =>
          <li key={facet.value} className="flex items-center justify-between">
              <label className="flex flex-1 items-center gap-2.5 text-sm text-ink">
                <input
                type="checkbox"
                checked={filters.categories.includes(facet.value)}
                onChange={() => toggleArrayValue('categories', facet.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
              
                {facet.value}
              </label>
              <span className="text-xs text-ink-muted">({facet.count})</span>
            </li>
          )}
        </ul>
      </FilterSection>

      <FilterSection title="Brand">
        <ul className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {brandFacets.map((facet) =>
          <li key={facet.value} className="flex items-center justify-between">
              <label className="flex flex-1 items-center gap-2.5 text-sm text-ink">
                <input
                type="checkbox"
                checked={filters.brands.includes(facet.value)}
                onChange={() => toggleArrayValue('brands', facet.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
              
                {facet.value}
              </label>
              <span className="text-xs text-ink-muted">({facet.count})</span>
            </li>
          )}
        </ul>
      </FilterSection>

      <FilterSection title="Rating">
        <ul className="space-y-2.5">
          {[4, 3, 2, 1].map((rating) =>
          <li key={rating}>
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                type="radio"
                name="rating-filter"
                checked={filters.minRating === rating}
                onChange={() =>
                onChange({
                  ...filters,
                  minRating: filters.minRating === rating ? null : rating
                })
                }
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary/30" />
              
                <span className="flex items-center gap-1">
                  {Array.from({
                  length: 5
                }).map((_, i) =>
                <StarIcon
                  key={i}
                  className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />

                )}
                  <span className="ml-1 text-ink-muted">&amp; up</span>
                </span>
              </label>
            </li>
          )}
        </ul>
      </FilterSection>

      <FilterSection title="Discount">
        <ul className="space-y-2.5">
          {[10, 20, 30, 50].map((discount) =>
          <li key={discount}>
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                type="radio"
                name="discount-filter"
                checked={filters.minDiscount === discount}
                onChange={() =>
                onChange({
                  ...filters,
                  minDiscount:
                  filters.minDiscount === discount ? null : discount
                })
                }
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary/30" />
              
                {discount}% or more
              </label>
            </li>
          )}
        </ul>
      </FilterSection>

      <FilterSection title="Availability">
        <label className="flex items-center justify-between text-sm text-ink">
          <span className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={() =>
              onChange({
                ...filters,
                inStockOnly: !filters.inStockOnly
              })
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
            
            In Stock Only
          </span>
          <span className="text-xs text-ink-muted">({inStockCount})</span>
        </label>
      </FilterSection>
    </div>);

}
export function FilterSidebarMobileSheet({
  open,
  onClose,
  ...sidebarProps



}: FilterSidebarProps & {open: boolean;onClose: () => void;}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filters">
      
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden="true" />
      
      <div className="relative max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="mx-auto h-1 w-10 rounded-full bg-gray-200" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100">
            
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <FilterSidebar {...sidebarProps} className="!border-none !p-0" />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-5"
          onClick={onClose}>
          
          Show Results
        </Button>
      </div>
    </div>);

}