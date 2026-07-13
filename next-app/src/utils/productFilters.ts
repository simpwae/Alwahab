import { Product } from '../types';
import { ListingFilters, SortOption } from '../components/listing/types';

export function applyFilters(
products: Product[],
filters: ListingFilters)
: Product[] {
  return products.filter((p) => {
    if (
    filters.categories.length > 0 &&
    !filters.categories.includes(p.category))

    return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand))
    return false;
    if (filters.minRating !== null && p.rating < filters.minRating) return false;
    if (filters.minDiscount !== null && p.discountPct < filters.minDiscount)
    return false;
    if (filters.inStockOnly && (p.stockQty === 0 || p.status === 'OutOfStock'))
    return false;
    if (p.sellingPrice > filters.maxPrice) return false;
    return true;
  });
}

export function applySort(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'newest':
      return sorted.sort(
        (a, b) => (b.ribbon === 'New' ? 1 : 0) - (a.ribbon === 'New' ? 1 : 0)
      );
    case 'price-asc':
      return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
    case 'price-desc':
      return sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
    case 'discount':
      return sorted.sort((a, b) => b.discountPct - a.discountPct);
    case 'best-selling':
      return sorted.sort((a, b) => b.unitsSold - a.unitsSold);
    case 'top-rated':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function slugToCategory(slug: string): string | null {
  const map: Record<string, string> = {
    electronics: 'Electronics',
    accessories: 'Accessories',
    'home-kitchen': 'Home & Kitchen',
    gadgets: 'Gadgets',
    lifestyle: 'Lifestyle'
  };
  return map[slug] ?? null;
}

export function categoryToSlug(category: string): string {
  return category.
  toLowerCase().
  replace(/\s*&\s*/g, '-').
  replace(/\s+/g, '-');
}