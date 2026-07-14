"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MenuIcon,
  XIcon,
  LayoutDashboardIcon,
  ShoppingBagIcon,
  PackageIcon,
  UsersIcon,
  TagIcon,
  PercentIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon } from
'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
{ label: 'Dashboard', href: '/admin', icon: LayoutDashboardIcon },
{ label: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
{ label: 'Products', href: '/admin/products', icon: PackageIcon },
{ label: 'Discounts', href: '/admin/discounts', icon: PercentIcon },
{ label: 'Customers', href: '/admin/customers', icon: UsersIcon },
{ label: 'Coupons', href: '/admin/coupons', icon: TagIcon },
{ label: 'Reviews', href: '/admin/reviews', icon: MessageSquareIcon },
{ label: 'Settings', href: '/admin/settings', icon: SettingsIcon }];


function BrandMark() {
  return (
    <span className="inline-flex items-center gap-0.5 font-display text-lg font-extrabold lg:text-xl">
      Alwahab
      <span className="mb-3 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
    </span>);

}

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
  href === '/admin' ?
  pathname === '/admin' :
  pathname.startsWith(href);

  const handleLogout = async () => {
    // Hard navigation, not router.push(): see AccountNav's handleLogout for why
    // (avoids the logout-vs-ProtectedRoute-redirect race). Awaited so
    // signOut() finishes clearing the session before the reload.
    await logout();
    window.location.href = '/admin/login';
  };

  const navList = (onNavigate?: () => void) =>
  <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>

            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>);

      })}
    </nav>;


  const accountBlock =
  <div className="border-t border-white/10 pt-4">
      <p className="truncate px-3.5 pb-2 text-xs text-white/50">{admin?.email}</p>
      <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">

        <LogOutIcon className="h-4 w-4 shrink-0" />
        Log Out
      </button>
    </div>;


  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
        <Link href="/admin">
          <BrandMark />
        </Link>
        <button
          type="button"
          aria-label="Open admin menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10">

          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen &&
        <>
            <motion.div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)} />

            <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-ink p-4 text-white shadow-2xl lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}>

              <div className="flex items-center justify-between">
                <BrandMark />
                <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10">

                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex-1 overflow-y-auto">
                {navList(() => setMobileOpen(false))}
              </div>
              {accountBlock}
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col">
        <Link href="/admin" className="px-5 py-5">
          <BrandMark />
          <span className="ml-1.5 text-xs font-medium text-white/50">Admin</span>
        </Link>
        <div className="flex-1 px-3 py-2">{navList()}</div>
        <div className="px-3 py-4">{accountBlock}</div>
      </aside>
    </>);

}
