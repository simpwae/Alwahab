import { describe, it, expect } from 'vitest';
import { applyFilters, applySort, slugToCategory, categoryToSlug } from './productFilters';
import { createDefaultFilters } from '../components/listing/types';
import { Product } from '../types';

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: 'p1',
    name: 'Product',
    category: 'Electronics',
    brand: 'BrandA',
    images: [],
    sizes: [],
    description: '',
    specs: [],
    originalPrice: 1000,
    sellingPrice: 1000,
    discountPct: 0,
    stockQty: 10,
    lowStockThreshold: 2,
    sku: 'SKU-1',
    unitsSold: 0,
    rating: 4,
    reviewCount: 0,
    ribbon: 'none',
    status: 'Active',
    featured: false,
    ...overrides
  };
}

const products: Product[] = [
makeProduct({ id: 'p1', category: 'Electronics', brand: 'BrandA', sellingPrice: 1000, discountPct: 10, rating: 4, stockQty: 5 }),
makeProduct({ id: 'p2', category: 'Gadgets', brand: 'BrandB', sellingPrice: 2000, discountPct: 30, rating: 2, stockQty: 0, status: 'OutOfStock' }),
makeProduct({ id: 'p3', category: 'Electronics', brand: 'BrandB', sellingPrice: 500, discountPct: 0, rating: 5, stockQty: 10 })];


describe('applyFilters', () => {
  it('filters by category', () => {
    const result = applyFilters(products, { ...createDefaultFilters(), categories: ['Electronics'] });
    expect(result.map((p) => p.id)).toEqual(['p1', 'p3']);
  });

  it('filters by brand', () => {
    const result = applyFilters(products, { ...createDefaultFilters(), brands: ['BrandB'] });
    expect(result.map((p) => p.id)).toEqual(['p2', 'p3']);
  });

  it('filters by minRating', () => {
    const result = applyFilters(products, { ...createDefaultFilters(), minRating: 4 });
    expect(result.map((p) => p.id)).toEqual(['p1', 'p3']);
  });

  it('excludes out-of-stock when inStockOnly is set', () => {
    const result = applyFilters(products, { ...createDefaultFilters(), inStockOnly: true });
    expect(result.map((p) => p.id)).toEqual(['p1', 'p3']);
  });

  it('filters by maxPrice', () => {
    const result = applyFilters(products, { ...createDefaultFilters(), maxPrice: 900 });
    expect(result.map((p) => p.id)).toEqual(['p3']);
  });
});

describe('applySort', () => {
  it('sorts by price ascending', () => {
    const result = applySort(products, 'price-asc');
    expect(result.map((p) => p.id)).toEqual(['p3', 'p1', 'p2']);
  });

  it('sorts by discount descending', () => {
    const result = applySort(products, 'discount');
    expect(result.map((p) => p.id)).toEqual(['p2', 'p1', 'p3']);
  });

  it('does not mutate the input array', () => {
    const copy = [...products];
    applySort(products, 'price-asc');
    expect(products).toEqual(copy);
  });
});

describe('slug/category mapping', () => {
  it('round-trips a multi-word category', () => {
    const slug = categoryToSlug('Home & Kitchen');
    expect(slug).toBe('home-kitchen');
    expect(slugToCategory(slug)).toBe('Home & Kitchen');
  });

  it('returns null for an unknown slug', () => {
    expect(slugToCategory('not-a-category')).toBeNull();
  });
});
