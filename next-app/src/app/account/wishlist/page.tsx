"use client";

import React from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { AccountLayout } from '../../../components/account/AccountLayout';
import { ProductGrid } from '../../../components/listing/ProductGrid';
import { useWishlist } from '../../../context/WishlistContext';
import { useProducts } from '../../../context/ProductContext';

function AccountWishlist() {
  const { ids } = useWishlist();
  const { products: allProducts } = useProducts();
  const products = allProducts.filter((p) => ids.includes(p.id));

  return (
    <AccountLayout
      title="My Wishlist"
      breadcrumb={[{ label: 'Account', href: '/account' }, { label: 'Wishlist' }]}>

      <p className="mb-4 text-sm text-ink-muted">
        {products.length} item{products.length === 1 ? '' : 's'} saved.
      </p>
      <ProductGrid
        products={products}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Tap the heart on any product to save it here for later." />

    </AccountLayout>);

}

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountWishlist />
    </ProtectedRoute>);

}
