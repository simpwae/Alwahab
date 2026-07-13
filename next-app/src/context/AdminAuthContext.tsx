"use client";

import React, { useState, useEffect, createContext, useContext , ReactNode } from 'react';
import { Admin } from '../types';
import { sampleAdmins } from '../data/sampleAdmins';

const STORAGE_KEY = 'alwahab_admin';

interface AdminAuthContextValue {
  admin: Admin | null;
  login: (email: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function loadStoredAdmin(): Admin | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Admin) : null;
}

export function AdminAuthProvider({ children }: {children: ReactNode;}) {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    setAdmin(loadStoredAdmin());
  }, []);

  const persist = (next: Admin | null) => {
    setAdmin(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));else
    localStorage.removeItem(STORAGE_KEY);
  };

  // Mock auth: password isn't checked, only that the email matches a seeded admin.
  const login = (email: string) => {
    const found = sampleAdmins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) return false;
    persist(found);
    return true;
  };

  const logout = () => persist(null);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>);

}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
