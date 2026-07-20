"use client";

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopUtilityBar } from '../../../components/layout/TopUtilityBar';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/CartDrawer';
import { useAuth } from '../../../context/AuthContext';

function CallbackStatus() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error_description') || searchParams.get('error');

  useEffect(() => {
    if (isInitialized && user) {
      router.replace('/account');
    }
  }, [isInitialized, user, router]);

  if (errorMessage) {
    return (
      <>
        <p className="text-sm text-ink-muted">{errorMessage.replace(/\+/g, ' ')}</p>
        <Link href="/login" className="mt-4 inline-block font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </>
    );
  }

  return <p className="text-sm text-ink-muted">Signing you in…</p>;
}

export default function AuthCallback() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <Suspense fallback={<p className="text-sm text-ink-muted">Signing you in…</p>}>
          <CallbackStatus />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
