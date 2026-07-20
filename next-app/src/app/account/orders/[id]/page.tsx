"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import {
  PackageSearchIcon,
  MapPinIcon,
  TruckIcon,
  BuildingIcon,
  CreditCardIcon } from
'lucide-react';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { AccountLayout } from '../../../../components/account/AccountLayout';
import { StatusBadge, PAYMENT_STATUS_VARIANT } from '../../../../components/ui/StatusBadge';
import { EmptyState } from '../../../../components/states/EmptyState';
import { StatusTimeline } from '../../../../components/track-order/StatusTimeline';
import { useOrders } from '../../../../context/OrderContext';
import { Order, PaymentMethod } from '../../../../types';

const PKR = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });
const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: 'Cash on Delivery',
  BankTransfer: 'Bank Transfer',
  Stripe: 'Credit / Debit Card'
};
const PAYMENT_STATUS_LABEL: Record<Order['paymentStatus'], string> = {
  Paid: 'Paid',
  AwaitingVerification: 'Awaiting Verification',
  Pending: 'Pending',
  Failed: 'Failed'
};

function AccountOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const order = id ? getOrderById(id) : undefined;

  return (
    <AccountLayout
      title={order ? `Order #${order.id}` : 'Order Not Found'}
      breadcrumb={[
      { label: 'Account', href: '/account' },
      { label: 'Orders', href: '/account/orders' },
      { label: id ?? '' }]
      }>

      {!order ?
      <EmptyState
        icon={<PackageSearchIcon className="h-8 w-8" />}
        title="Order not found"
        description="We couldn't find an order with that number on your account." /> :


      <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-ink-muted">Order Number</p>
                <p className="font-display text-lg font-bold text-ink">
                  #{order.id}
                </p>
              </div>
              <StatusBadge
              label={PAYMENT_STATUS_LABEL[order.paymentStatus]}
              variant={PAYMENT_STATUS_VARIANT[order.paymentStatus]} />

            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="min-w-[420px]">
                <StatusTimeline status={order.fulfillmentStatus} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
              <div className="flex items-center gap-2.5">
                {order.paymentMethod === 'COD' ?
              <TruckIcon className="h-4 w-4 shrink-0 text-primary" /> :
              order.paymentMethod === 'BankTransfer' ?
              <BuildingIcon className="h-4 w-4 shrink-0 text-primary" /> :

              <CreditCardIcon className="h-4 w-4 shrink-0 text-primary" />
              }
                <div>
                  <p className="text-xs text-ink-muted">Payment Method</p>
                  <p className="text-sm font-medium text-ink">
                    {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                  </p>
                </div>
              </div>
              {order.trackingNumber &&
            <div className="flex items-center gap-2.5">
                  <PackageSearchIcon className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-ink-muted">Tracking Number</p>
                    <p className="text-sm font-medium text-ink">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
            }
              {order.shippingAddress &&
            <div className="flex items-center gap-2.5">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-ink-muted">Delivery Address</p>
                    <p className="text-sm font-medium text-ink">
                      {order.shippingAddress.line1}, {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
            }
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100">
            <h2 className="border-b border-gray-100 p-5 font-display text-base font-bold text-ink">
              Order Items
            </h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) =>
            <li
              key={`${item.productId}-${item.size ?? ''}`}
              className="flex items-center gap-3 p-4 sm:p-5">

                  <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover" />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {item.size ? `Size ${item.size} · ` : ''}Qty {item.qty} · PKR {PKR.format(item.price)}
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
        </div>
      }
    </AccountLayout>);

}

export default function Page() {
  return (
    <ProtectedRoute>
      <AccountOrderDetail />
    </ProtectedRoute>);

}
