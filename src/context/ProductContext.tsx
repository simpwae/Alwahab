import React, { useState, createContext, useContext } from 'react';
import { Product } from '../types';
import { sampleProducts } from '../data/sampleProducts';

interface ProductContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  applyDiscount: (ids: string[], discountPct: number) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: {children: ReactNode;}) {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };
  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const applyDiscount = (ids: string[], discountPct: number) => {
    const idSet = new Set(ids);
    setProducts((prev) =>
    prev.map((p) =>
    idSet.has(p.id) ?
    { ...p, sellingPrice: Math.round(p.originalPrice * (1 - discountPct / 100)), discountPct } :
    p
    )
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, applyDiscount }}>
      {children}
    </ProductContext.Provider>);

}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
