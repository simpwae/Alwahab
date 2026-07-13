"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboardIcon,
  PackageIcon,
  HeartIcon,
  MapPinIcon,
  UserIcon,
  LogOutIcon } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
{ label: 'Dashboard', href: '/account', icon: LayoutDashboardIcon },
{ label: 'Orders', href: '/account/orders', icon: PackageIcon },
{ label: 'Wishlist', href: '/account/wishlist', icon: HeartIcon },
{ label: 'Addresses', href: '/account/addresses', icon: MapPinIcon },
{ label: 'Profile', href: '/account/profile', icon: UserIcon }];


export function AccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Hard navigation, not router.push(): logging out while on a protected
    // page races ProtectedRoute's own reactive "no user -> /login" redirect
    // (both fire off the same user-becomes-null update), and that redirect
    // can win, landing on /login instead of home. A full reload sidesteps
    // the race and guarantees every context resets to its logged-out state.
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-2 lg:flex-col lg:overflow-visible">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary' : 'text-ink-muted hover:bg-surface hover:text-ink'}`}>

            <Icon className="h-4 w-4" />
            {item.label}
          </Link>);

      })}
      <button
        type="button"
        onClick={handleLogout}
        className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 lg:mt-2">

        <LogOutIcon className="h-4 w-4" />
        Log Out
      </button>
    </nav>);

}
