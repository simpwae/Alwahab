"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogInIcon, MailIcon, LockIcon } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }
    const ok = login(email);
    if (!ok) {
      setError('No account found with that email.');
      return;
    }
    router.replace('/account');
  };

  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-md px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Login' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Sign in to view your orders, wishlist, and account details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-gray-100 p-5">

          <FormField
            label="Email Address"
            id="login-email"
            type="email"
            placeholder="you@example.com"
            leadingIcon={<MailIcon className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error || undefined} />


          <FormField
            label="Password"
            id="login-password"
            type="password"
            placeholder="••••••••"
            leadingIcon={<LockIcon className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)} />


          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<LogInIcon className="h-4 w-4" />}>

            Sign In
          </Button>

          <p className="text-center text-sm text-ink-muted">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <p className="mt-4 rounded-xl bg-surface p-3 text-xs text-ink-muted">
          Demo accounts: ayesha.khan@example.com, bilal.ahmed@example.com,
          sara.malik@example.com (any password).
        </p>
      </main>

      <Footer />
    </div>);

}
