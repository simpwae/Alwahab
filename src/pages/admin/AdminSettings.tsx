import React, { useState } from 'react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export function AdminSettings() {
  const { settings, updateSettings } = useStoreSettings();
  const [bankTransfer, setBankTransfer] = useState(settings.bankTransfer);
  const [shipping, setShipping] = useState({
    flatRate: String(settings.shipping.flatRate),
    freeShippingThreshold: String(settings.shipping.freeShippingThreshold)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bankTransfer,
      shipping: {
        flatRate: Number(shipping.flatRate) || 0,
        freeShippingThreshold: Number(shipping.freeShippingThreshold) || 0
      }
    });
    toast.success('Settings saved');
  };

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-sm font-bold text-ink">
            Bank Transfer Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Bank Name"
              id="bankName"
              value={bankTransfer.bankName}
              onChange={(e) =>
              setBankTransfer((prev) => ({ ...prev, bankName: e.target.value }))
              } />

            <FormField
              label="Account Title"
              id="accountTitle"
              value={bankTransfer.accountTitle}
              onChange={(e) =>
              setBankTransfer((prev) => ({
                ...prev,
                accountTitle: e.target.value
              }))
              } />

            <FormField
              label="Account Number"
              id="accountNumber"
              value={bankTransfer.accountNumber}
              onChange={(e) =>
              setBankTransfer((prev) => ({
                ...prev,
                accountNumber: e.target.value
              }))
              } />

            <FormField
              label="IBAN"
              id="iban"
              value={bankTransfer.iban}
              onChange={(e) =>
              setBankTransfer((prev) => ({ ...prev, iban: e.target.value }))
              } />

            <FormField
              label="Branch Code"
              id="branchCode"
              value={bankTransfer.branchCode}
              onChange={(e) =>
              setBankTransfer((prev) => ({
                ...prev,
                branchCode: e.target.value
              }))
              } />

          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-sm font-bold text-ink">Shipping</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Flat Shipping Rate (PKR)"
              id="flatRate"
              type="number"
              value={shipping.flatRate}
              onChange={(e) =>
              setShipping((prev) => ({ ...prev, flatRate: e.target.value }))
              } />

            <FormField
              label="Free Shipping Threshold (PKR)"
              id="freeShippingThreshold"
              type="number"
              value={shipping.freeShippingThreshold}
              onChange={(e) =>
              setShipping((prev) => ({
                ...prev,
                freeShippingThreshold: e.target.value
              }))
              } />

          </div>
        </section>

        <Button type="submit" variant="primary">
          Save Settings
        </Button>
      </form>
    </AdminLayout>);

}
