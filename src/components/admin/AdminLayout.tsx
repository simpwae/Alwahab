import React from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-surface lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {title}
          </h1>
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>);

}
