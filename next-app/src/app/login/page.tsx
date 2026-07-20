"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogInIcon, MailIcon, LockIcon } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const loginError = await login(email, password);
    setIsSubmitting(false);
    if (loginError) {
      setError(loginError);
      return;
    }
    router.replace('/account');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    const googleError = await signInWithGoogle();
    if (googleError) {
      setIsGoogleSubmitting(false);
      toast.error(googleError);
    }
    // On success the browser navigates away to Google, so isGoogleSubmitting
    // intentionally stays true until then - there's no "done" state to reset to.
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
            disabled={isSubmitting}
            icon={<LogInIcon className="h-4 w-4" />}>

            {isSubmitting ? 'Signing In…' : 'Sign In'}
          </Button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-ink-muted">or continue with</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isGoogleSubmitting}
            icon={<GoogleIcon />}
            onClick={handleGoogleSignIn}>

            {isGoogleSubmitting ? 'Redirecting…' : 'Continue with Google'}
          </Button>

          <p className="text-center text-sm text-ink-muted">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>);

}
