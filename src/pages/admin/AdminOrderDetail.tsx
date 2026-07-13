import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageSearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge, PAYMENT_STATUS_VARIANT } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/states/EmptyState';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useOrders } from '../../context/OrderContext';
import { FulfillmentStatus, PaymentStatus } from '../../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const FULFILLMENT_OPTIONS: FulfillmentStatus[] = [
'Pending',
'Confirmed',
'Shipped',
'Delivered',
'Cancelled'];

const PAYMENT_OPTIONS: PaymentStatus[] = [
'Pending',
'AwaitingVerification',
'Paid',
'Failed'];


export function AdminOrderDetail() {
  const { id } = useParams();
  const { getOrderById, updateOrder } = useOrders();
  const order = id ? getOrderById(id) : undefined;

  const [fulfillmentStatus, setFulfillmentStatus] = useState(
    order?.fulfillmentStatus ?? 'Pending'
  );
  const [paymentStatus, setPaymentStatus] = useState(
    order?.paymentStatus ?? 'Pending'
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber ?? ''
  );

  if (!order) {
    return (
      <AdminLayout title="Order Not Found">
        <EmptyState
          icon={<PackageSearchIcon className="h-8 w-8" />}
          title="Order not found"
          description="No order exists with that number." />

      </AdminLayout>);

  }

  const handleSave = () => {
    updateOrder(order.id, {
      fulfillmentStatus,
      paymentStatus,
      trackingNumber: trackingNumber.trim() || undefined
    });
    toast.success('Order updated');
  };

  return (
    <AdminLayout title={`Order #${order.id}`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
            <div>
              <p className="text-xs text-ink-muted">Customer</p>
              <p className="text-sm font-medium text-ink">
                {order.customer} {order.email && `· ${order.email}`}
              </p>
            </div>
            <StatusBadge
              label={order.paymentStatus}
              variant={PAYMENT_STATUS_VARIANT[order.paymentStatus]} />

          </div>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) =>
            <li key={item.productId} className="flex items-center gap-3 p-4 sm:p-5">
                <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover" />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-ink">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Qty {item.qty} · PKR {PKR.format(item.price)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink">
                  PKR {PKR.format(item.price * item.qty)}
                </span>
              </li>
            )}
          </ul>
          <div className="flex justify-between border-t border-gray-100 p-5 text-base">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-display font-bold text-ink">
              PKR {PKR.format(order.total)}
            </span>
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="font-display text-sm font-bold text-ink">
            Update Status
          </h2>

          <div>
            <label
              htmlFor="fulfillment-status"
              className="mb-1.5 block text-sm font-medium text-ink">

              Fulfillment Status
            </label>
            <select
              id="fulfillment-status"
              value={fulfillmentStatus}
              onChange={(e) =>
              setFulfillmentStatus(e.target.value as FulfillmentStatus)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

              {FULFILLMENT_OPTIONS.map((opt) =>
              <option key={opt} value={opt}>{opt}</option>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-status"
              className="mb-1.5 block text-sm font-medium text-ink">

              Payment Status
            </label>
            <select
              id="payment-status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

              {PAYMENT_OPTIONS.map((opt) =>
              <option key={opt} value={opt}>{opt}</option>
              )}
            </select>
          </div>

          <FormField
            label="Tracking Number"
            id="tracking-number"
            placeholder="e.g. TCS-1234567"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)} />


          <Button variant="primary" fullWidth onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>);

}
