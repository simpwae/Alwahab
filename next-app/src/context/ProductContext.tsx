"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Product, ProductSize } from '../types';
import { createClient } from '../lib/supabase/client';

// Reads are public (products_select_public); writes require an authenticated
// admin (products_write_admin checks is_admin()), same admin-keyed-client
// pattern as StoreSettingsContext/ReviewContext/CouponContext.
const supabase = createClient('alwahab-admin-auth');

interface ProductContextValue {
  products: Product[];
  addProduct: (product: Product) => Promise<string | null>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<string | null>;
  deleteProduct: (id: string) => Promise<string | null>;
  deleteProducts: (ids: string[]) => Promise<string | null>;
  applyDiscount: (ids: string[], discountPct: number) => Promise<string | null>;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

interface ProductRow {
  id: string;
  name: string;
  category: string;
  brand: string;
  images: string[];
  sizes: ProductSize[];
  description: string;
  specs: string[];
  original_price: number;
  selling_price: number;
  discount_pct: number;
  stock_qty: number;
  low_stock_threshold: number;
  sku: string;
  units_sold: number;
  rating: number;
  review_count: number;
  ribbon: Product['ribbon'];
  status: Product['status'];
  featured: boolean;
}

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    brand: row.brand,
    images: row.images,
    sizes: row.sizes,
    description: row.description,
    specs: row.specs,
    originalPrice: row.original_price,
    sellingPrice: row.selling_price,
    discountPct: row.discount_pct,
    stockQty: row.stock_qty,
    lowStockThreshold: row.low_stock_threshold,
    sku: row.sku,
    unitsSold: row.units_sold,
    rating: row.rating,
    reviewCount: row.review_count,
    ribbon: row.ribbon,
    status: row.status,
    featured: row.featured
  };
}

function toRow(product: Product): ProductRow {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    images: product.images,
    sizes: product.sizes,
    description: product.description,
    specs: product.specs,
    original_price: product.originalPrice,
    selling_price: product.sellingPrice,
    discount_pct: product.discountPct,
    stock_qty: product.stockQty,
    low_stock_threshold: product.lowStockThreshold,
    sku: product.sku,
    units_sold: product.unitsSold,
    rating: product.rating,
    review_count: product.reviewCount,
    ribbon: product.ribbon,
    status: product.status,
    featured: product.featured
  };
}

export function ProductProvider({ children }: {children: ReactNode;}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts((data ?? []).map((row) => fromRow(row as ProductRow)));
    });
  }, []);

  const addProduct = async (product: Product) => {
    const { error } = await supabase.from('products').insert(toRow(product));
    if (error) return error.message;
    setProducts((prev) => [product, ...prev]);
    return null;
  };

  const updateProduct = async (id: string, patch: Partial<Product>) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return 'Product not found.';
    const next = { ...existing, ...patch };
    const { error } = await supabase.from('products').update(toRow(next)).eq('id', id);
    if (error) return error.message;
    setProducts((prev) => prev.map((p) => p.id === id ? next : p));
    return null;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return error.message;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return null;
  };

  const deleteProducts = async (ids: string[]) => {
    const { error } = await supabase.from('products').delete().in('id', ids);
    if (error) return error.message;
    const idSet = new Set(ids);
    setProducts((prev) => prev.filter((p) => !idSet.has(p.id)));
    return null;
  };

  const applyDiscount = async (ids: string[], discountPct: number) => {
    const idSet = new Set(ids);
    const rows = products.
    filter((p) => idSet.has(p.id)).
    map((p) => ({
      id: p.id,
      selling_price: Math.round(p.originalPrice * (1 - discountPct / 100)),
      discount_pct: discountPct
    }));
    // Not a single bulk upsert: each row needs a different computed
    // selling_price, and PostgREST's upsert validates the implicit insert's
    // NOT NULL columns (name, category, sku, ...) before ON CONFLICT
    // resolution even applies, so a partial-row upsert fails outright.
    const results = await Promise.all(
      rows.map((row) =>
      supabase.from('products').update({ selling_price: row.selling_price, discount_pct: row.discount_pct }).eq('id', row.id)
      )
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) return failed.error.message;
    setProducts((prev) =>
    prev.map((p) =>
    idSet.has(p.id) ?
    { ...p, sellingPrice: Math.round(p.originalPrice * (1 - discountPct / 100)), discountPct } :
    p
    )
    );
    return null;
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, deleteProducts, applyDiscount }}>
      {children}
    </ProductContext.Provider>);

}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
