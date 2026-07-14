"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase/client';
import { User, Address } from '../types';

const supabase = createClient('alwahab-customer-auth');

interface AuthContextValue {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (patch: { name?: string; phone?: string }) => Promise<void>;
  changePassword: (newPassword: string) => Promise<string | null>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, patch: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function hydrateUser(authUserId: string, email: string): Promise<User | null> {
  const [{ data: profile }, { data: addresses }] = await Promise.all([
  supabase.from('profiles').select('name, phone, joined_date').eq('id', authUserId).single(),
  supabase.from('addresses').select('id, label, line1, city, phone').eq('user_id', authUserId)]
  );
  if (!profile) return null;
  return {
    id: authUserId,
    name: profile.name,
    email,
    phone: profile.phone ?? '',
    addresses: (addresses ?? []) as Address[],
    wishlist: [],
    joinedDate: profile.joined_date
  };
}

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user?.email) {
      setUser(null);
      return;
    }
    setUser(await hydrateUser(session.user.id, session.user.email));
  }, []);

  // Supabase persists its own session (localStorage, keyed by the storageKey
  // passed to createClient) — isInitialized just tracks whether the initial
  // getSession() call has resolved yet, so ProtectedRoute can tell "still
  // checking" apart from "confirmed logged out" instead of redirecting early.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      refreshFromSession(session).finally(() => setIsInitialized(true));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      refreshFromSession(session);
    });
    return () => subscription.unsubscribe();
  }, [refreshFromSession]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    // Hydrate user state before returning, not just via the onAuthStateChange
    // listener below: callers navigate to a protected route immediately
    // after this resolves, and ProtectedRoute's isInitialized is already
    // true from the earlier unauthenticated page load, so it won't wait for
    // the listener's async refresh - it would see a stale null user and
    // bounce straight back to /login.
    await refreshFromSession(data.session);
    return null;
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    });
    if (error) return error.message;
    await refreshFromSession(data.session);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (patch: { name?: string; phone?: string }) => {
    if (!user) return;
    await supabase.from('profiles').update(patch).eq('id', user.id);
    setUser((prev) => prev ? { ...prev, ...patch } : prev);
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? error.message : null;
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return;
    const { data } = await supabase.
    from('addresses').
    insert({ user_id: user.id, ...address }).
    select('id, label, line1, city, phone').
    single();
    if (data) {
      setUser((prev) => prev ? { ...prev, addresses: [...prev.addresses, data as Address] } : prev);
    }
  };

  const updateAddress = async (id: string, patch: Omit<Address, 'id'>) => {
    await supabase.from('addresses').update(patch).eq('id', id);
    setUser((prev) =>
    prev ? { ...prev, addresses: prev.addresses.map((a) => a.id === id ? { id, ...patch } : a) } : prev
    );
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setUser((prev) => prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) } : prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitialized,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress
      }}>

      {children}
    </AuthContext.Provider>);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
