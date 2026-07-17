"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient } from '../lib/supabase/client';
import { useAdminAuth } from './AdminAuthContext';

// profiles has no email column (it lives in auth.users, not exposed through
// the API) - admin_list_customers() joins the two server-side, gated to
// is_admin() internally, since it's a SECURITY DEFINER function rather than
// a plain RLS-filtered table read.
const supabase = createClient('alwahab-admin-auth');

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  joinedDate: string;
}

interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  joined_date: string;
  email: string;
}

interface CustomerContextValue {
  customers: Customer[];
}

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { admin } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!admin) {
      setCustomers([]);
      return;
    }
    supabase.rpc('admin_list_customers').then(({ data }) => {
      setCustomers(
        ((data ?? []) as CustomerRow[]).map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          joinedDate: row.joined_date
        }))
      );
    });
  }, [admin]);

  return (
    <CustomerContext.Provider value={{ customers }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider');
  return ctx;
}
