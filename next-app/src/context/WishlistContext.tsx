"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { createClient } from '../lib/supabase/client';
import { useAuth } from './AuthContext';

const supabase = createClient('alwahab-customer-auth');

interface WishlistContextValue {
  ids: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: {children: ReactNode;}) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setIds([]);
      return;
    }
    supabase.from('wishlist_items').select('product_id').eq('user_id', user.id).then(({ data }) => {
      setIds((data ?? []).map((row) => row.product_id));
    });
  }, [user]);

  const isWishlisted = (productId: string) => ids.includes(productId);

  // Optimistic: flip local state immediately (this drives a heart-icon
  // click), roll back if the write fails.
  const toggleWishlist = (productId: string) => {
    if (!user) {
      toast.error('Log in to save items to your wishlist');
      return;
    }
    const wasWishlisted = ids.includes(productId);
    setIds((prev) => wasWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]);

    const write = wasWishlisted ?
    supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId) :
    supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId });

    write.then(({ error }) => {
      if (!error) return;
      setIds((prev) => wasWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId));
      toast.error('Could not update wishlist');
    });
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
