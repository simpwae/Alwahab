"use client";

import React from 'react';
import Link from 'next/link';
import {
  CpuIcon,
  WatchIcon,
  UtensilsCrossedIcon,
  ZapIcon,
  SparklesIcon,
  FlameIcon } from
'lucide-react';
interface CategoryTile {
  label: string;
  href: string;
  icon: React.ReactNode;
  image: string;
}
const TILES: CategoryTile[] = [
{
  label: 'Electronics',
  href: '/category/electronics',
  icon: <CpuIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=300&q=80'
},
{
  label: 'Accessories',
  href: '/category/accessories',
  icon: <WatchIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80'
},
{
  label: 'Home & Kitchen',
  href: '/category/home-kitchen',
  icon: <UtensilsCrossedIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=300&q=80'
},
{
  label: 'Gadgets',
  href: '/category/gadgets',
  icon: <ZapIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
},
{
  label: 'Lifestyle',
  href: '/category/lifestyle',
  icon: <SparklesIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300&q=80'
},
{
  label: 'Deals',
  href: '/deals',
  icon: <FlameIcon className="h-5 w-5" />,
  image:
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=300&q=80'
}];

export function CategoryTiles() {
  return (
    <section aria-label="Shop by category">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TILES.map((tile) =>
        <Link
          key={tile.label}
          href={tile.href}
          className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">

            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary-50">
              <img
              src={tile.image}
              alt=""
              className="h-full w-full object-cover"
              aria-hidden="true" />

              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white">
                {tile.icon}
              </span>
            </div>
            <span className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
              {tile.label}
            </span>
          </Link>
        )}
      </div>
    </section>);

}
