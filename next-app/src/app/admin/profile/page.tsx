"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { MailIcon, UserIcon, LockIcon, SaveIcon } from 'lucide-react';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface PasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
}

function AdminProfile() {
  const { admin, changePassword } = useAdminAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: PasswordErrors = {};
    if (newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
    if (confirmPassword !== newPassword) errors.confirmPassword = 'Passwords do not match.';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const error = await changePassword(newPassword);
    if (error) {
      setPasswordErrors({ newPassword: error });
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated');
  };

  return (
    <AdminLayout title="My Profile">
      <div className="max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
        <FormField
          label="Name"
          id="admin-profile-name"
          leadingIcon={<UserIcon className="h-4 w-4" />}
          value={admin?.name ?? ''}
          disabled
        />
        <FormField
          label="Email Address"
          id="admin-profile-email"
          type="email"
          leadingIcon={<MailIcon className="h-4 w-4" />}
          value={admin?.email ?? ''}
          disabled
          hint="Contact a fellow admin to change your account email."
        />
      </div>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-6 max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-5">

        <h2 className="font-display text-sm font-bold text-ink">Change Password</h2>

        <FormField
          label="New Password"
          id="admin-new-password"
          type="password"
          leadingIcon={<LockIcon className="h-4 w-4" />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={passwordErrors.newPassword}
        />

        <FormField
          label="Confirm New Password"
          id="admin-confirm-password"
          type="password"
          leadingIcon={<LockIcon className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordErrors.confirmPassword}
        />

        <Button type="submit" variant="primary" size="md" icon={<SaveIcon className="h-4 w-4" />}>
          Update Password
        </Button>
      </form>
    </AdminLayout>
  );
}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminProfile />
    </AdminProtectedRoute>
  );
}
