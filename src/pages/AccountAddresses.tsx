import React, { useState } from 'react';
import { MapPinIcon, PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { AccountLayout } from '../components/account/AccountLayout';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/states/EmptyState';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

const EMPTY_FORM = { label: '', line1: '', city: '', phone: '' };

export function AccountAddresses() {
  const { user, updateUser } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const addresses = user?.addresses ?? [];

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      line1: address.line1,
      city: address.city,
      phone: address.phone
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim() || !form.line1.trim() || !form.city.trim() || !form.phone.trim()) {
      return;
    }
    const next = editingId ?
    addresses.map((a) => a.id === editingId ? { ...a, ...form } : a) :
    [...addresses, { id: `a${Date.now()}`, ...form }];
    updateUser({ addresses: next });
    cancelForm();
  };

  const handleDelete = (id: string) => {
    updateUser({ addresses: addresses.filter((a) => a.id !== id) });
  };

  return (
    <AccountLayout
      title="My Addresses"
      breadcrumb={[{ label: 'Account', href: '/account' }, { label: 'Addresses' }]}>

      {!showForm &&
      <Button variant="primary" size="md" icon={<PlusIcon className="h-4 w-4" />} onClick={startAdd}>
          Add Address
        </Button>
      }

      {showForm &&
      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-4 rounded-2xl border border-gray-100 p-5">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
            label="Label"
            id="address-label"
            placeholder="e.g. Home, Office"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })} />

            <FormField
            label="Phone"
            id="address-phone"
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          </div>
          <FormField
          label="Street Address"
          id="address-line1"
          placeholder="House / Street / Area"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })} />

          <FormField
          label="City"
          id="address-city"
          placeholder="e.g. Lahore"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })} />

          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="md">
              {editingId ? 'Save Changes' : 'Add Address'}
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      }

      {!showForm && addresses.length === 0 &&
      <div className="mt-4">
          <EmptyState
          icon={<MapPinIcon className="h-8 w-8" />}
          title="No saved addresses"
          description="Add a delivery address to speed up checkout next time." />

        </div>
      }

      {!showForm && addresses.length > 0 &&
      <ul className="mt-4 space-y-3">
          {addresses.map((address) =>
        <li
          key={address.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 p-4 sm:p-5">

              <div>
                <p className="font-display text-sm font-bold text-ink">
                  {address.label}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {address.line1}, {address.city}
                </p>
                <p className="text-sm text-ink-muted">{address.phone}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
              type="button"
              onClick={() => startEdit(address)}
              aria-label="Edit address"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-primary">

                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
              type="button"
              onClick={() => handleDelete(address.id)}
              aria-label="Delete address"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-red-50 hover:text-red-600">

                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </li>
        )}
        </ul>
      }
    </AccountLayout>);

}
