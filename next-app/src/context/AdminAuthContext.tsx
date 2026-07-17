"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '../lib/supabase/client';
import { Admin } from '../types';

// Separate storageKey from AuthContext's client: a customer and an admin can
// be signed in at once, each with their own independent Supabase session,
// mirroring the old alwahab_user/alwahab_admin split.
const supabase = createClient('alwahab-admin-auth');

interface AdminAuthContextValue {
  admin: Admin | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<string | null>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

async function hydrateAdmin(authUserId: string): Promise<Admin | null> {
  // maybeSingle, not single: a signed-in user who isn't an admin is a valid,
  // expected outcome here (that's the whole point of this check), not an
  // exceptional one - single() would log a 406 for the routine zero-rows case.
  const { data } = await supabase.
  from('admins').
  select('id, name, email').
  eq('id', authUserId).
  maybeSingle();
  return data as Admin | null;
}

export function AdminAuthProvider({ children }: {children: ReactNode;}) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setAdmin(null);
      return;
    }
    setAdmin(await hydrateAdmin(session.user.id));
  }, []);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;

    // Being authenticated isn't the same as being an admin - the admins
    // table (RLS-gated to is_admin()) is the real authorization check.
    const { data: { session } } = await supabase.auth.getSession();
    const found = session?.user ? await hydrateAdmin(session.user.id) : null;
    if (!found) {
      await supabase.auth.signOut();
      return 'No admin account found with that email.';
    }
    setAdmin(found);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? error.message : null;
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isInitialized, login, logout, changePassword }}>
      {children}
    </AdminAuthContext.Provider>);

}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
