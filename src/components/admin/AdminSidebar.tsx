import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  PackageIcon,
  UsersIcon,
  TagIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon } from
'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
{ label: 'Dashboard', href: '/admin', icon: LayoutDashboardIcon },
{ label: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
{ label: 'Products', href: '/admin/products', icon: PackageIcon },
{ label: 'Customers', href: '/admin/customers', icon: UsersIcon },
{ label: 'Coupons', href: '/admin/coupons', icon: TagIcon },
{ label: 'Reviews', href: '/admin/reviews', icon: MessageSquareIcon },
{ label: 'Settings', href: '/admin/settings', icon: SettingsIcon }];


export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="sticky top-0 z-20 flex w-full shrink-0 items-center gap-1 overflow-x-auto bg-ink px-3 py-2 text-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-visible lg:px-0 lg:py-0">
      <Link
        to="/admin"
        className="inline-flex shrink-0 items-center gap-0.5 px-2 py-2 font-display text-lg font-extrabold lg:px-5 lg:py-5 lg:text-xl">
        Alwahab
        <span className="mb-3 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        <span className="ml-1.5 hidden text-xs font-medium text-white/50 sm:inline lg:inline">
          Admin
        </span>
      </Link>

      <nav className="flex flex-1 items-center gap-1 lg:flex-col lg:items-stretch lg:gap-1 lg:px-3 lg:py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
          item.href === '/admin' ?
          location.pathname === '/admin' :
          location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.label}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:px-3.5 ${isActive ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>

              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>);

        })}
      </nav>

      <div className="ml-auto flex shrink-0 items-center lg:ml-0 lg:mt-auto lg:w-full lg:flex-col lg:items-stretch lg:border-t lg:border-white/10 lg:px-3 lg:py-4">
        <p className="hidden truncate px-3.5 pb-2 text-xs text-white/50 lg:block">
          {admin?.email}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log Out"
          title={admin?.email}
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:w-full lg:px-3.5">

          <LogOutIcon className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">Log Out</span>
        </button>
      </div>
    </aside>);

}
