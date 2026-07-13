"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlusIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('All fields are required.');
      return;
    }
    signup(name, email, phone);
    router.replace('/account');
  };

  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-md px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Sign Up' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Create Your Account
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Join Alwahab to track orders, save your wishlist, and check out
          faster.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-gray-100 p-5">

          <FormField
            label="Full Name"
            id="signup-name"
            placeholder="Your name"
            leadingIcon={<UserIcon className="h-4 w-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error && !name.trim() ? error : undefined} />


          <FormField
            label="Email Address"
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            leadingIcon={<MailIcon className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email.trim() ? error : undefined} />


          <FormField
            label="Phone Number"
            id="signup-phone"
            type="tel"
            placeholder="03XX-XXXXXXX"
            leadingIcon={<PhoneIcon className="h-4 w-4" />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error && !phone.trim() ? error : undefined} />


          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<UserPlusIcon className="h-4 w-4" />}>

            Create Account
          </Button>

          <p className="text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </div>);

}
