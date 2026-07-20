"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2Icon,
  ClockIcon,
  TruckIcon,
  BuildingIcon,
  CreditCardIcon,
  MapPinIcon,
  ArrowRightIcon } from
'lucide-react';
import { Header } from '../../../components/layout/Header';
import { TopUtilityBar } from '../../../components/layout/TopUtilityBar';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/CartDrawer';
import { Button } from '../../../components/ui/Button';
import {
  StatusBadge,
  PAYMENT_STATUS_VARIANT } from
'../../../components/ui/StatusBadge';
import { EmptyState } from '../../../components/states/EmptyState';
import { useOrders } from '../../../context/OrderContext';
import { Order, PaymentMethod } from '../../../types';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
const PAYMENT_METHOD_META: Record<
  PaymentMethod,
  {
    label: string;
    icon: React.ReactNode;
  }> =
{
  COD: {
    label: 'Cash on Delivery',
    icon: <TruckIcon className="h-4 w-4" />
  },
  BankTransfer: {
    label: 'Bank Transfer',
    icon: <BuildingIcon className="h-4 w-4" />
  },
  Stripe: {
    label: 'Credit / Debit Card',
    icon: <CreditCardIcon className="h-4 w-4" />
  }
};
const PAYMENT_STATUS_LABEL: Record<Order['paymentStatus'], string> = {
  Paid: 'Paid',
  AwaitingVerification: 'Awaiting Verification',
  Pending: 'Pending',
  Failed: 'Failed'
};
export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId ?? '');
  if (!order) {
    return (
      <div className="min-h-full w-full bg-white">
        <TopUtilityBar />
        <Header />
        <CartDrawer />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <EmptyState
            title="Order not found"
            description="We couldn't find an order matching this link. Check your email confirmation or track your order below."
            actionLabel="Track an Order"
            onAction={() => {
              window.location.href = '/track-order';
            }} />

        </main>
        <Footer />
      </div>);

  }
  const paymentMeta = PAYMENT_METHOD_META[order.paymentMethod];
  const isManualMethod = order.paymentMethod === 'BankTransfer';
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary">
            <CheckCircle2Icon className="h-9 w-9" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
            Order Placed Successfully!
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Order <span className="font-semibold text-ink">#{order.id}</span> ·
            Placed on {order.date}
          </p>
        </div>

        {isManualMethod &&
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              We&rsquo;ve received your receipt — we&rsquo;ll confirm shortly.
              Your order status will update to &ldquo;Confirmed&rdquo; once our
              team verifies your bank transfer, usually within a few hours.
            </p>
          </div>
        }

        <div className="mt-6 rounded-2xl border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
            <div className="flex items-center gap-2 text-sm text-ink">
              {paymentMeta.icon}
              <span className="font-medium">{paymentMeta.label}</span>
            </div>
            <StatusBadge
              label={PAYMENT_STATUS_LABEL[order.paymentStatus]}
              variant={PAYMENT_STATUS_VARIANT[order.paymentStatus]} />

          </div>

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

          <div className="space-y-2.5 border-t border-gray-100 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span className="font-medium text-ink">
                PKR {PKR.format(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 &&
            <div className="flex justify-between">
                <span className="text-ink-muted">
                  Discount{order.couponCode ? ` (${order.couponCode})` : ''}
                </span>
                <span className="font-medium text-primary">
                  -PKR {PKR.format(order.discount)}
                </span>
              </div>
            }
            <div className="flex justify-between">
              <span className="text-ink-muted">Shipping</span>
              <span className="font-medium text-ink">
                {order.shipping === 0 ?
                'Free' :
                `PKR ${PKR.format(order.shipping)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5 text-base">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display font-bold text-ink">
                PKR {PKR.format(order.total)}
              </span>
            </div>
          </div>

          {order.shippingAddress &&
          <div className="flex items-start gap-2.5 border-t border-gray-100 p-5 text-sm text-ink-muted">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                {order.shippingAddress.line1}, {order.shippingAddress.city}
              </span>
            </div>
          }
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/track-order?orderId=${encodeURIComponent(order.id)}&email=${encodeURIComponent(order.email ?? '')}`}
            className="flex-1">

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon={<ArrowRightIcon className="h-4 w-4" />}>

              Track Order
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="primary" size="lg" fullWidth>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>);

}
