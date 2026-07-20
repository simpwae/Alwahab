"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { UploadCloudIcon, XIcon, Loader2Icon } from 'lucide-react';
import { AdminProtectedRoute } from '../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../components/admin/AdminLayout';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/states/EmptyState';
import { useProducts } from '../context/ProductContext';
import { Product, ProductStatus } from '../types';
import { CATEGORIES } from '../data/categories';

const STATUSES: ProductStatus[] = ['Active', 'Draft', 'OutOfStock'];

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset!);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed');
  return data.secure_url as string;
}

interface FormValues {
  name: string;
  category: string;
  brand: string;
  images: string[];
  sizes: string[];
  description: string;
  sku: string;
  originalPrice: string;
  sellingPrice: string;
  stockQty: string;
  lowStockThreshold: string;
  status: ProductStatus;
  featured: boolean;
}

function productToForm(p: Product): FormValues {
  return {
    name: p.name,
    category: p.category,
    brand: p.brand,
    images: p.images,
    sizes: p.sizes,
    description: p.description,
    sku: p.sku,
    originalPrice: String(p.originalPrice),
    sellingPrice: String(p.sellingPrice),
    stockQty: String(p.stockQty),
    lowStockThreshold: String(p.lowStockThreshold),
    status: p.status,
    featured: p.featured
  };
}

const EMPTY_FORM: FormValues = {
  name: '',
  category: CATEGORIES[0],
  brand: '',
  images: [],
  sizes: [],
  description: '',
  sku: '',
  originalPrice: '',
  sellingPrice: '',
  stockQty: '',
  lowStockThreshold: '5',
  status: 'Draft',
  featured: false
};

function AdminProductForm() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const { products, addProduct, updateProduct } = useProducts();
  const isEdit = Boolean(id);
  const existing = isEdit ? products.find((p) => p.id === id) : undefined;

  const [values, setValues] = useState<FormValues>(
    existing ? productToForm(existing) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>(
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [sizeInput, setSizeInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // products arrives from an async context fetch, which may still be in
  // flight when this component first mounts - without this, editing a
  // product that hadn't loaded yet at mount time would silently show (and
  // let you save) blank/default values instead of the real ones.
  useEffect(() => {
    if (existing) setValues(productToForm(existing));
  }, [existing]);

  if (isEdit && !existing) {
    return (
      <AdminLayout title="Product Not Found">
        <EmptyState title="Product not found" description="No product exists with that id." />
      </AdminLayout>);

  }

  const handleChange = (field: keyof FormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setValues((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addSize = () => {
    const size = sizeInput.trim();
    if (!size || values.sizes.includes(size)) {
      setSizeInput('');
      return;
    }
    setValues((prev) => ({ ...prev, sizes: [...prev.sizes, size] }));
    setSizeInput('');
  };

  const removeSize = (size: string) => {
    setValues((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== size) }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Name is required.';
    if (!values.sku.trim()) next.sku = 'SKU is required.';
    if (!values.originalPrice || Number(values.originalPrice) <= 0)
    next.originalPrice = 'Enter a valid price.';
    if (!values.sellingPrice || Number(values.sellingPrice) <= 0)
    next.sellingPrice = 'Enter a valid price.';
    if (values.stockQty === '' || Number(values.stockQty) < 0)
    next.stockQty = 'Enter a valid stock quantity.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const originalPrice = Number(values.originalPrice);
    const sellingPrice = Number(values.sellingPrice);
    const discountPct =
    originalPrice > sellingPrice ?
    Math.round((originalPrice - sellingPrice) / originalPrice * 100) :
    0;

    let error: string | null;
    if (isEdit && existing) {
      error = await updateProduct(existing.id, {
        name: values.name,
        category: values.category,
        brand: values.brand,
        images: values.images,
        sizes: values.sizes,
        description: values.description,
        sku: values.sku,
        originalPrice,
        sellingPrice,
        discountPct,
        stockQty: Number(values.stockQty),
        lowStockThreshold: Number(values.lowStockThreshold),
        status: values.status,
        featured: values.featured
      });
    } else {
      const product: Product = {
        id: `p${Date.now()}`,
        name: values.name,
        category: values.category,
        brand: values.brand,
        images: values.images,
        sizes: values.sizes,
        description: values.description,
        specs: [],
        originalPrice,
        sellingPrice,
        discountPct,
        stockQty: Number(values.stockQty),
        lowStockThreshold: Number(values.lowStockThreshold),
        sku: values.sku,
        unitsSold: 0,
        rating: 0,
        reviewCount: 0,
        ribbon: 'none',
        status: values.status,
        featured: values.featured
      };
      error = await addProduct(product);
    }

    if (error) {
      toast.error(error);
      return;
    }
    toast.success(isEdit ? 'Product updated' : 'Product created');
    router.push('/admin/products');
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">

        <FormField
          label="Product Name"
          id="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name} />


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
              Category
            </label>
            <select
              id="category"
              value={values.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FormField
            label="Brand"
            id="brand"
            value={values.brand}
            onChange={(e) => handleChange('brand', e.target.value)} />

        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Images</label>
          <div className="flex flex-wrap gap-3">
            {values.images.map((url, i) =>
            <div key={url + i} className="group relative h-20 w-20 shrink-0">
                <img
                src={url}
                alt=""
                className="h-full w-full rounded-xl border border-gray-200 object-cover" />

                <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white shadow-sm hover:bg-red-600">

                  <XIcon className="h-3.5 w-3.5" />
                </button>
                {i === 0 &&
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Cover
                  </span>
              }
              </div>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-ink-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-50">

              {uploading ?
              <Loader2Icon className="h-5 w-5 animate-spin" /> :

              <UploadCloudIcon className="h-5 w-5" />
              }
              <span className="text-[11px] font-medium">Add</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
            aria-label="Upload product images" />

        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Sizes</label>
          <div className="flex flex-wrap items-center gap-2">
            {values.sizes.map((size) =>
            <span
              key={size}
              className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink">

                {size}
                <button
                type="button"
                aria-label={`Remove size ${size}`}
                onClick={() => removeSize(size)}
                className="text-ink-muted hover:text-red-600">

                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addSize();
                }
              }}
              onBlur={addSize}
              placeholder="e.g. S, M, L or 150cm — press Enter"
              className="min-w-[10rem] flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

          </div>
          <p className="mt-1.5 text-xs text-ink-muted">
            Leave empty if this product doesn&apos;t come in sizes.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="SKU"
            id="sku"
            value={values.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            error={errors.sku} />

          <FormField
            label="Original Price (PKR)"
            id="originalPrice"
            type="number"
            value={values.originalPrice}
            onChange={(e) => handleChange('originalPrice', e.target.value)}
            error={errors.originalPrice} />

          <FormField
            label="Selling Price (PKR)"
            id="sellingPrice"
            type="number"
            value={values.sellingPrice}
            onChange={(e) => handleChange('sellingPrice', e.target.value)}
            error={errors.sellingPrice} />

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="Stock Quantity"
            id="stockQty"
            type="number"
            value={values.stockQty}
            onChange={(e) => handleChange('stockQty', e.target.value)}
            error={errors.stockQty} />

          <FormField
            label="Low Stock Threshold"
            id="lowStockThreshold"
            type="number"
            value={values.lowStockThreshold}
            onChange={(e) => handleChange('lowStockThreshold', e.target.value)} />


          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink">
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value as ProductStatus)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

          Featured product
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/products')}>

            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>);

}

export function AdminProductFormScreen() {
  return (
    <AdminProtectedRoute>
      <AdminProductForm />
    </AdminProtectedRoute>);

}
