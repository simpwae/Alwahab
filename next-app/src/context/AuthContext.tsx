"use client";

import React, { useState, useEffect, createContext, useContext , ReactNode } from 'react';
import { User } from '../types';
import { sampleUsers } from '../data/sampleUsers';

const STORAGE_KEY = 'alwahab_user';

interface AuthContextValue {
  user: User | null;
  isInitialized: boolean;
  login: (email: string) => boolean;
  signup: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorage isn't available during SSR, so `user` always starts null here.
  // isInitialized lets consumers (e.g. ProtectedRoute) tell "still checking" apart
  // from "confirmed logged out" instead of redirecting before this effect runs.
  useEffect(() => {
    setUser(loadStoredUser());
    setIsInitialized(true);
  }, []);

  const persist = (next: User | null) => {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));else
    localStorage.removeItem(STORAGE_KEY);
  };

  // Mock auth: password isn't checked, only that the email matches a seeded user.
  const login = (email: string) => {
    const found = sampleUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found) return false;
    persist(found);
    return true;
  };

  const signup = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      addresses: [],
      wishlist: [],
      joinedDate: new Date().toISOString().slice(0, 10)
    };
    persist(newUser);
  };

  const logout = () => persist(null);

  const updateUser = (patch: Partial<User>) => {
    if (!user) return;
    persist({ ...user, ...patch });
  };

  return (
    <AuthContext.Provider value={{ user, isInitialized, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
