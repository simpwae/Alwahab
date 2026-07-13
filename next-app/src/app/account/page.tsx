"use client";

import React from 'react';
import Link from 'next/link';
import { PackageIcon, HeartIcon, MapPinIcon } from 'lucide-react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AccountLayout } from '../../components/account/AccountLayout';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useWishlist } from '../../context/WishlistContext';

function AccountDashboard() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { itemCount: wishlistCount } = useWishlist();
  const myOrders = orders.filter(
    (o) => o.email?.toLowerCase() === user?.email.toLowerCase()
  );

  return (
    <AccountLayout title="My Account" breadcrumb={[{ label: 'Account' }]}>
      <p className="text-sm text-ink-muted">
        Welcome back, <span className="font-medium text-ink">{user?.name}</span>.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="rounded-2xl border border-gray-100 p-5 transition-shadow hover:shadow-card">

          <PackageIcon className="h-6 w-6 text-primary" />
          <p className="mt-3 font-display text-xl font-bold text-ink">
            {myOrders.length}
          </p>
          <p className="text-sm text-ink-muted">Orders</p>
        </Link>
        <Link
          href="/account/wishlist"
          className="rounded-2xl border border-gray-100 p-5 transition-shadow hover:shadow-card">

          <HeartIcon className="h-6 w-6 text-accent" />
          <p className="mt-3 font-display text-xl font-bold text-ink">
            {wishlistCount}
          </p>
          <p className="text-sm text-ink-muted">Wishlist Items</p>
        </Link>
        <Link
          href="/account/addresses"
          className="rounded-2xl border border-gray-100 p-5 transition-shadow hover:shadow-card">

          <MapPinIcon className="h-6 w-6 text-primary" />
          <p className="mt-3 font-display text-xl font-bold text-ink">
            {user?.addresses.length ?? 0}
          </p>
          <p className="text-sm text-ink-muted">Saved Addresses</p>
        </Link>
      </div>
    </AccountLayout>);

}

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountDashboard />
    </ProtectedRoute>);

}
