import React, { useState } from 'react';
import { toast } from 'sonner';
import { UserIcon, MailIcon, PhoneIcon, SaveIcon } from 'lucide-react';
import { AccountLayout } from '../components/account/AccountLayout';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function AccountProfile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    updateUser({ name, phone });
    toast.success('Profile updated');
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
    </AccountLayout>);

}
