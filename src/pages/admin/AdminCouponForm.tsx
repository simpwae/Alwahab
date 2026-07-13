import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/states/EmptyState';
import { useCoupons } from '../../context/CouponContext';
import { Coupon } from '../../types';

const STATUSES: Coupon['status'][] = ['Active', 'Scheduled', 'Expired'];

interface FormValues {
  code: string;
  type: '%' | 'flat';
  value: string;
  minOrder: string;
  usageLimit: string;
  validFrom: string;
  validTo: string;
  status: Coupon['status'];
}

function couponToForm(c: Coupon): FormValues {
  return {
    code: c.code,
    type: c.type,
    value: String(c.value),
    minOrder: String(c.minOrder),
    usageLimit: String(c.usageLimit),
    validFrom: c.validFrom,
    validTo: c.validTo,
    status: c.status
  };
}

const EMPTY_FORM: FormValues = {
  code: '',
  type: '%',
  value: '',
  minOrder: '0',
  usageLimit: '100',
  validFrom: new Date().toISOString().slice(0, 10),
  validTo: '',
  status: 'Active'
};

export function AdminCouponForm() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { coupons, addCoupon, updateCoupon } = useCoupons();
  const isEdit = Boolean(code);
  const existing = isEdit ? coupons.find((c) => c.code === code) : undefined;

  const [values, setValues] = useState<FormValues>(
    existing ? couponToForm(existing) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>(
    {}
  );

  if (isEdit && !existing) {
    return (
      <AdminLayout title="Coupon Not Found">
        <EmptyState title="Coupon not found" description="No coupon exists with that code." />
      </AdminLayout>);

  }

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.code.trim()) next.code = 'Code is required.';
    else if (
    !isEdit &&
    coupons.some((c) => c.code.toLowerCase() === values.code.trim().toLowerCase()))

    next.code = 'A coupon with this code already exists.';
    if (!values.value || Number(values.value) <= 0)
    next.value = 'Enter a valid value.';
    if (!values.validTo) next.validTo = 'Enter an expiry date.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const patch: Omit<Coupon, 'code'> = {
      type: values.type,
      value: Number(values.value),
      minOrder: Number(values.minOrder),
      usageLimit: Number(values.usageLimit),
      validFrom: values.validFrom,
      validTo: values.validTo,
      status: values.status
    };

    if (isEdit && existing) {
      updateCoupon(existing.code, patch);
      toast.success('Coupon updated');
    } else {
      addCoupon({ code: values.code.trim().toUpperCase(), ...patch });
      toast.success('Coupon created');
    }
    navigate('/admin/coupons');
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Coupon' : 'Add Coupon'}>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">

        <FormField
          label="Coupon Code"
          id="code"
          placeholder="e.g. SAVE500"
          value={values.code}
          disabled={isEdit}
          onChange={(e) => handleChange('code', e.target.value)}
          error={errors.code} />


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-ink">
              Discount Type
            </label>
            <select
              id="type"
              value={values.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

              <option value="%">Percentage (%)</option>
              <option value="flat">Flat Amount (PKR)</option>
            </select>
          </div>
          <FormField
            label={values.type === '%' ? 'Value (%)' : 'Value (PKR)'}
            id="value"
            type="number"
            value={values.value}
            onChange={(e) => handleChange('value', e.target.value)}
            error={errors.value} />

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Minimum Order (PKR)"
            id="minOrder"
            type="number"
            value={values.minOrder}
            onChange={(e) => handleChange('minOrder', e.target.value)} />

          <FormField
            label="Usage Limit"
            id="usageLimit"
            type="number"
            value={values.usageLimit}
            onChange={(e) => handleChange('usageLimit', e.target.value)} />

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Valid From"
            id="validFrom"
            type="date"
            value={values.validFrom}
            onChange={(e) => handleChange('validFrom', e.target.value)} />

          <FormField
            label="Valid To"
            id="validTo"
            type="date"
            value={values.validTo}
            onChange={(e) => handleChange('validTo', e.target.value)}
            error={errors.validTo} />

        </div>

        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink">
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Create Coupon'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/coupons')}>

            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>);

}
