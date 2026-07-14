"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminProtectedRoute({ children }: {children: ReactNode;}) {
  const { admin, isInitialized } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !admin) router.replace('/admin/login');
  }, [isInitialized, admin, router]);

  if (!isInitialized || !admin) return null;
  return <>{children}</>;
}
