import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-100 p-2 lg:flex-col lg:overflow-visible">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
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
