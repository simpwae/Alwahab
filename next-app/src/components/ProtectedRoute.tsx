"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: {children: ReactNode;}) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) router.replace('/login');
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) return null;
  return <>{children}</>;
}
