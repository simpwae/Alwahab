"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { PackageIcon, PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { StatusBadge, PRODUCT_STATUS_VARIANT } from '../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/states/EmptyState';
import { Button } from '../../../components/ui/Button';
import { useProducts } from '../../../context/ProductContext';
import { useOrders } from '../../../context/OrderContext';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const PAGE_SIZE = 8;

function AdminProducts() {
  const { products, deleteProduct, deleteProducts } = useProducts();
  const { orders } = useOrders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const referencedIds = useMemo(
    () => new Set(orders.flatMap((o) => o.items.map((i) => i.productId))),
    [orders]
  );

  const visible = products.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < products.length;
  const allVisibleSelected = visible.length > 0 && visible.every((p) => selectedIds.includes(p.id));

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) =>
    allVisibleSelected ?
    prev.filter((id) => !visible.some((p) => p.id === id)) :
    [...new Set([...prev, ...visible.map((p) => p.id)])]
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (referencedIds.has(id)) {
      toast.error(`Can't delete "${name}" — it's referenced by an existing order.`);
      return;
    }
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    deleteProduct(id);
    toast.success('Product deleted');
  };

  const handleBulkDelete = () => {
    const blocked = selectedIds.filter((id) => referencedIds.has(id));
    const deletable = selectedIds.filter((id) => !referencedIds.has(id));
    if (deletable.length === 0) {
      toast.error('All selected products are referenced by existing orders and can\'t be deleted.');
      return;
    }
    if (!window.confirm(`Delete ${deletable.length} product${deletable.length > 1 ? 's' : ''}? This can't be undone.`)) return;
    deleteProducts(deletable);
    setSelectedIds([]);
    if (blocked.length > 0) {
      toast.warning(`${deletable.length} deleted, ${blocked.length} skipped — referenced by existing orders.`);
    } else {
      toast.success(`${deletable.length} product${deletable.length > 1 ? 's' : ''} deleted`);
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="mb-4 flex items-center justify-between gap-3">
        {selectedIds.length > 0 ?
        <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-muted">{selectedIds.length} selected</span>
            <button
            type="button"
            onClick={handleBulkDelete}
            className="rounded-lg px-3 py-1.5 font-medium text-red-600 hover:bg-red-50">

              Delete Selected
            </button>
          </div> :

        <span />
        }
        <Link href="/admin/products/new">
          <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ?
      <EmptyState
        icon={<PackageIcon className="h-8 w-8" />}
        title="No products yet"
        description="Add your first product to get started." /> :


      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-ink-muted">
                <th className="px-4 py-3">
                  <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

                </th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">SKU</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Stock</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((p) => {
                const isLowStock = p.stockQty <= p.lowStockThreshold;
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${p.name}`}
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelected(p.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" />

                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg border border-gray-100 object-cover" />

                        <span className="line-clamp-1 max-w-[140px] font-medium text-ink sm:max-w-none">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-ink-muted md:table-cell">
                      {p.sku}
                    </td>
                    <td className="hidden px-4 py-3 text-ink-muted lg:table-cell">
                      {p.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">
                      PKR {PKR.format(p.sellingPrice)}
                    </td>
                    <td
                      className={`hidden px-4 py-3 font-medium sm:table-cell ${isLowStock ? 'text-accent-dark' : 'text-ink'}`}>

                      {p.stockQty}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge
                        label={p.status}
                        variant={PRODUCT_STATUS_VARIANT[p.status]} />

                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          aria-label={`Edit ${p.name}`}
                          className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-primary">

                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${p.name}`}
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded-lg p-2 text-ink-muted hover:bg-red-50 hover:text-red-600">

                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
          {hasMore &&
        <div className="flex justify-center border-t border-gray-100 p-4">
              <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                Load More
              </Button>
            </div>
        }
        </div>
      }
    </AdminLayout>);

}

export default function Page() {
  return (
    <AdminProtectedRoute>
      <AdminProducts />
    </AdminProtectedRoute>);

}
