export interface ListingFilters {
  categories: string[];
  brands: string[];
  minRating: number | null;
  minDiscount: number | null;
  inStockOnly: boolean;
  maxPrice: number;
}

export type SortOption =
'featured' |
'newest' |
'price-asc' |
'price-desc' |
'discount' |
'best-selling' |
'top-rated';

export const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  newest: 'New',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  discount: 'Discount %',
  'best-selling': 'Best Selling',
  'top-rated': 'Top Rated'
};

export const DEFAULT_MAX_PRICE = 20000;

export function createDefaultFilters(
maxPrice: number = DEFAULT_MAX_PRICE)
: ListingFilters {
  return {
    categories: [],
    brands: [],
    minRating: null,
    minDiscount: null,
    inStockOnly: false,
    maxPrice
  };
}