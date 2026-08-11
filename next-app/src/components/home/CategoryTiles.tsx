"use client";

import React from 'react';
import Link from 'next/link';
import { cloudinaryUrl } from '../../lib/cloudinary';
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
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462687/wabwhcc2kl6q16rnufkd.jpg'
},
{
  label: 'Accessories',
  href: '/category/accessories',
  icon: <WatchIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462688/uxap2jl6ozxecpbu8dtd.jpg'
},
{
  label: 'Home & Kitchen',
  href: '/category/home-kitchen',
  icon: <UtensilsCrossedIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462709/gxctjlpnuyhfpzq0mc16.jpg'
},
{
  label: 'Gadgets',
  href: '/category/gadgets',
  icon: <ZapIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462686/iotvmzgy9y9pjjlt6kpj.jpg'
},
{
  label: 'Lifestyle',
  href: '/category/lifestyle',
  icon: <SparklesIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462689/b5wjchrmyuscdzf5qb7b.jpg'
},
{
  label: 'Deals',
  href: '/deals',
  icon: <FlameIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462690/ewrzrh2uqhkzqzwsozng.jpg'
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
              src={cloudinaryUrl(tile.image, { width: 150 })}
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
