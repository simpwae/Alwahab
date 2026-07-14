"use client";

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { useProducts } from '../../../context/ProductContext';
import { CATEGORIES } from '../../../data/categories';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

type Scope = 'single' | 'bulk' | 'category';
const SCOPES: { value: Scope; label: string }[] = [
{ value: 'single', label: 'Single Product' },
{ value: 'bulk', label: 'Bulk Select' },
{ value: 'category', label: 'Category' }];


function AdminDiscounts() {
  const { products, applyDiscount } = useProducts();
  const [scope, setScope] = useState<Scope>('single');
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [discountPct, setDiscountPct] = useState('10');
  const [error, setError] = useState('');

  const targetIds = useMemo(() => {
    if (scope === 'single') return productId ? [productId] : [];
    if (scope === 'bulk') return selectedIds;
    return products.filter((p) => p.category === category).map((p) => p.id);
  }, [scope, productId, selectedIds, category, products]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleApply = async () => {
    const pct = Number(discountPct);
    if (!pct || pct <= 0 || pct >= 100) {
      setError('Enter a discount percentage between 1 and 99.');
      return;
    }
    if (targetIds.length === 0) {
      setError('Select at least one product.');
      return;
    }
    setError('');
    const applyError = await applyDiscount(targetIds, pct);
    if (applyError) {
      toast.error(applyError);
      return;
    }
    toast.success(`${pct}% discount applied to ${targetIds.length} product${targetIds.length > 1 ? 's' : ''}`);
  };

  return (
    <AdminLayout title="Discounts">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex rounded-xl border border-gray-200 p-0.5 text-sm">
            {SCOPES.map((s) =>
            <button
              key={s.value}
              type="button"
              onClick={() => setScope(s.value)}
              className={`flex-1 rounded-lg px-3 py-1.5 font-medium transition-colors ${scope === s.value ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'}`}>

                {s.label}
              </button>
            )}
          </div>

          {scope === 'single' &&
          <div className="mt-5">
              <label htmlFor="single-product" className="mb-1.5 block text-sm font-medium text-ink">
                Product
              </label>
              <select
              id="single-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                {products.map((p) =>
              <option key={p.id} value={p.id}>
                    {p.name} — PKR {PKR.format(p.sellingPrice)}
                  </option>
              )}
              </select>
            </div>
          }

          {scope === 'bulk' &&
          <div className="mt-5 max-h-80 divide-y divide-gray-100 overflow-y-auto rounded-xl border border-gray-100">
              {products.map((p) =>
            <label key={p.id} className="flex items-center gap-3 px-3.5 py-2.5 text-sm hover:bg-surface">
                  <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleSelected(p.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

                  <span className="flex-1 text-ink">{p.name}</span>
                  <span className="text-ink-muted">PKR {PKR.format(p.sellingPrice)}</span>
                </label>
            )}
            </div>
          }

          {scope === 'category' &&
          <div className="mt-5">
              <label htmlFor="discount-category" className="mb-1.5 block text-sm font-medium text-ink">
                Category
              </label>
              <select
              id="discount-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="mt-1.5 text-xs text-ink-muted">
                {targetIds.length} product{targetIds.length === 1 ? '' : 's'} in this category.
              </p>
            </div>
          }
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="font-display text-sm font-bold text-ink">Apply Discount</h2>
          <FormField
            label="Discount %"
            id="discount-pct"
            type="number"
            min={1}
            max={99}
            value={discountPct}
            onChange={(e) => setDiscountPct(e.target.value)}
            error={error} />

          <p className="text-xs text-ink-muted">
            {targetIds.length} product{targetIds.length === 1 ? '' : 's'} selected.
          </p>
          <Button variant="primary" fullWidth onClick={handleApply}>
            Apply Discount
          </Button>
        </div>
      </div>
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminDiscounts />
    </AdminProtectedRoute>);

}
