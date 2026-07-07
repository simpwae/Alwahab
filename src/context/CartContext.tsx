import React, { useMemo, useState, createContext, useContext } from 'react';
import { toast } from 'sonner';
import { Product } from '../types';
export interface CartLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  stockQty: number;
}
interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}
const CartContext = createContext<CartContextValue | undefined>(undefined);
export function CartProvider({ children }: {children: ReactNode;}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const addToCart = (product: Product, qty: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
        l.productId === product.id ?
        {
          ...l,
          qty: Math.min(l.qty + qty, product.stockQty || l.qty + qty)
        } :
        l
        );
      }
      return [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.sellingPrice,
        qty,
        stockQty: product.stockQty
      }];

    });
    toast.success('Added to cart', {
      description: product.name
    });
    setIsOpen(true);
  };
  const removeFromCart = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };
  const updateQty = (productId: string, qty: number) => {
    setLines((prev) =>
    prev.map((l) =>
    l.productId === productId ?
    {
      ...l,
      qty: Math.max(1, Math.min(qty, l.stockQty || qty))
    } :
    l
    )
    );
  };
  const clearCart = () => setLines([]);
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
    itemCount
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}