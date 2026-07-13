"use client";

import React from 'react';
import Link from 'next/link';
import { CompassIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <CompassIcon className="h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have
          moved.
        </p>
        <Link href="/" className="mt-6">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </main>

      <Footer />
    </div>);

}
