"use client";

import React from 'react';
import Link from 'next/link';
import { cloudinaryUrl } from '../../lib/cloudinary';
import {
  CpuIcon,
  UtensilsCrossedIcon,
  BabyIcon,
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
  label: 'Home & Kitchen',
  href: '/category/home-kitchen',
  icon: <UtensilsCrossedIcon className="h-5 w-5" />,
  image:
  'https://res.cloudinary.com/taptt8ob/image/upload/v1786462709/gxctjlpnuyhfpzq0mc16.jpg'
},
{
  label: 'Baby Gear',
  href: '/category/baby-gear',
  icon: <BabyIcon className="h-5 w-5" />,
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
