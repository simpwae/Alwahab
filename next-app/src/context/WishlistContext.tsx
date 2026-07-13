"use client";

import React, { useState, createContext, useContext , ReactNode } from 'react';

interface WishlistContextValue {
  ids: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: {children: ReactNode;}) {
  const [ids, setIds] = useState<string[]>([]);

  const isWishlisted = (productId: string) => ids.includes(productId);

  const toggleWishlist = (productId: string) => {
    setIds((prev) =>
    prev.includes(productId) ?
    prev.filter((id) => id !== productId) :
    [...prev, productId]
    );
  };

  const value: WishlistContextValue = {
    ids,
    isWishlisted,
    toggleWishlist,
    itemCount: ids.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>);

}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
