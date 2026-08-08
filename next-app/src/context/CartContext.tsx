"use client";

import React, { useMemo, useState, useEffect, createContext, useContext , ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '../types';

const CART_STORAGE_KEY = 'alwahab-cart';

function loadStoredCart(): { lines: CartLine[]; appliedCode: string | null } {
  if (typeof window === 'undefined') return { lines: [], appliedCode: null };
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { lines: [], appliedCode: null };
    const parsed = JSON.parse(raw);
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      appliedCode: typeof parsed.appliedCode === 'string' ? parsed.appliedCode : null
    };
  } catch {
    return { lines: [], appliedCode: null };
  }
}
export interface CartLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  stockQty: number;
  size?: string;
}
interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty?: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQty: (productId: string, qty: number, size?: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  appliedCode: string | null;
  setAppliedCode: (code: string | null) => void;
}
const CartContext = createContext<CartContextValue | undefined>(undefined);
export function CartProvider({ children }: {children: ReactNode;}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Hydrate from localStorage after mount (SSR-safe: server and first client
  // render both start empty, then this fills in) so a refresh doesn't wipe
  // the cart.
  useEffect(() => {
    const stored = loadStoredCart();
    if (stored.lines.length) setLines(stored.lines);
    if (stored.appliedCode) setAppliedCode(stored.appliedCode);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ lines, appliedCode }));
  }, [lines, appliedCode]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const addToCart = (product: Product, qty: number = 1, size?: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.size === size);
      if (existing) {
        return prev.map((l) =>
        l.productId === product.id && l.size === size ?
        {
          ...l,
          qty: Math.max(0, Math.min(l.qty + qty, product.stockQty))
        } :
        l
        );
      }
      const price = product.sizes.find((s) => s.label === size)?.price ?? product.sellingPrice;
      return [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price,
        qty,
        stockQty: product.stockQty,
        size
      }];

    });
    toast.success('Added to cart', {
      description: product.name
    });
    setIsOpen(true);
  };
  const removeFromCart = (productId: string, size?: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
  };
  const updateQty = (productId: string, qty: number, size?: string) => {
    setLines((prev) =>
    prev.flatMap((l) => {
      if (l.productId !== productId || l.size !== size) return [l];
      const clamped = Math.max(0, Math.min(qty, l.stockQty));
      return clamped === 0 ? [] : [{ ...l, qty: clamped }];
    })
    );
  };
  const clearCart = () => {
    setLines([]);
    setAppliedCode(null);
  };
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines]
  );
  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  );
  const value: CartContextValue = {
    lines,
    isOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
    itemCount,
    appliedCode,
    setAppliedCode
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}