"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { UserIcon, MailIcon, PhoneIcon, SaveIcon, LockIcon } from 'lucide-react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { AccountLayout } from '../../../components/account/AccountLayout';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

interface PasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
}

function AccountProfile() {
  const { user, updateUser, changePassword } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    await updateUser({ name, phone });
    toast.success('Profile updated');
  };

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
    <AccountLayout
      title="My Profile"
      breadcrumb={[{ label: 'Account', href: '/account' }, { label: 'Profile' }]}>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 rounded-2xl border border-gray-100 p-5">

        <FormField
          label="Full Name"
          id="profile-name"
          leadingIcon={<UserIcon className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)} />


        <FormField
          label="Email Address"
          id="profile-email"
          type="email"
          leadingIcon={<MailIcon className="h-4 w-4" />}
          value={user?.email ?? ''}
          disabled
          hint="Email can't be changed on this prototype." />


        <FormField
          label="Phone Number"
          id="profile-phone"
          type="tel"
          leadingIcon={<PhoneIcon className="h-4 w-4" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)} />


        <Button type="submit" variant="primary" size="md" icon={<SaveIcon className="h-4 w-4" />}>
          Save Changes
        </Button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-6 max-w-md space-y-4 rounded-2xl border border-gray-100 p-5">

        <h2 className="font-display text-sm font-bold text-ink">Change Password</h2>

        <FormField
          label="New Password"
          id="new-password"
          type="password"
          leadingIcon={<LockIcon className="h-4 w-4" />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={passwordErrors.newPassword} />


        <FormField
          label="Confirm New Password"
          id="confirm-password"
          type="password"
          leadingIcon={<LockIcon className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordErrors.confirmPassword} />


        <Button type="submit" variant="primary" size="md" icon={<SaveIcon className="h-4 w-4" />}>
          Update Password
        </Button>
      </form>
    </AccountLayout>);

}

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountProfile />
    </ProtectedRoute>);

}
