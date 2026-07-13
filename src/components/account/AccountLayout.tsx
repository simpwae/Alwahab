import React from 'react';
import { Header } from '../layout/Header';
import { TopUtilityBar } from '../layout/TopUtilityBar';
import { Footer } from '../layout/Footer';
import { CartDrawer } from '../CartDrawer';
import { Breadcrumb, BreadcrumbItem } from '../listing/Breadcrumb';
import { AccountNav } from './AccountNav';

interface AccountLayoutProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
  children: ReactNode;
}

export function AccountLayout({ title, breadcrumb, children }: AccountLayoutProps) {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          {title}
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <AccountNav />
          <div>{children}</div>
        </div>
      </main>

      <Footer />
    </div>);

}
