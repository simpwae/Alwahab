import React, { useState, createContext, useContext } from 'react';
import { Product } from '../types';
import { sampleProducts } from '../data/sampleProducts';

interface ProductContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>);

}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
