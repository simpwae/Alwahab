import React from 'react';
import { Link } from 'react-router-dom';
import { PackageIcon, PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge, PRODUCT_STATUS_VARIANT } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { Button } from '../../components/ui/Button';
import { useProducts } from '../../context/ProductContext';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

export function AdminProducts() {
  const { products, deleteProduct } = useProducts();

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    deleteProduct(id);
    toast.success('Product deleted');
  };

  return (
    <AdminLayout title="Products">
      <div className="mb-4 flex justify-end">
        <Link to="/admin/products/new">
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
              {products.map((p) => {
                const isLowStock = p.stockQty <= p.lowStockThreshold;
                return (
                  <tr key={p.id}>
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
                          to={`/admin/products/${p.id}/edit`}
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
        </div>
      }
    </AdminLayout>);

}
