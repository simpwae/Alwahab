"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SearchIcon,
  PackageSearchIcon,
  MapPinIcon,
  TruckIcon,
  BuildingIcon,
  CreditCardIcon } from
'lucide-react';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Breadcrumb } from '../components/listing/Breadcrumb';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import {
  StatusBadge,
  PAYMENT_STATUS_VARIANT } from
'../components/ui/StatusBadge';
import { EmptyState } from '../components/states/EmptyState';
import { StatusTimeline } from '../components/track-order/StatusTimeline';
import { useOrders } from '../context/OrderContext';
import { Order, PaymentMethod } from '../types';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
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
export function TrackOrderScreen() {
  const { findOrder } = useOrders();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') ?? '');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
  const runLookup = (id: string, mail: string) => {
    if (!id.trim() || !mail.trim()) return;
    const found = findOrder(id, mail);
    setResult(found ?? null);
    setSearched(true);
  };
  useEffect(() => {
    if (searchParams.get('orderId') && searchParams.get('email')) {
      runLookup(
        searchParams.get('orderId') ?? '',
        searchParams.get('email') ?? ''
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runLookup(orderId, email);
  };
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb
          items={[
          {
            label: 'Track Order'
          }]
          } />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Track Your Order
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Enter your order number and the email address used at checkout to see
          your order status.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-gray-100 p-5">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Order Number"
              id="track-order-id"
              placeholder="e.g. ALW-10234"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)} />

            <FormField
              label="Email Address"
              id="track-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-4"
            icon={<SearchIcon className="h-4 w-4" />}>

            Track Order
          </Button>
        </form>

        {searched && !result &&
        <div className="mt-6">
            <EmptyState
            icon={<PackageSearchIcon className="h-8 w-8" />}
            title="Order not found"
            description="We couldn't find an order matching that order number and email address. Double-check and try again." />

          </div>
        }

        {result &&
        <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">Order Number</p>
                  <p className="font-display text-lg font-bold text-ink">
                    #{result.id}
                  </p>
                </div>
                <StatusBadge
                label={PAYMENT_STATUS_LABEL[result.paymentStatus]}
                variant={PAYMENT_STATUS_VARIANT[result.paymentStatus]} />

              </div>

              <div className="mt-6 overflow-x-auto pb-2">
                <div className="min-w-[420px]">
                  <StatusTimeline status={result.fulfillmentStatus} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div className="flex items-center gap-2.5">
                  {result.paymentMethod === 'COD' ?
                <TruckIcon className="h-4 w-4 shrink-0 text-primary" /> :
                result.paymentMethod === 'BankTransfer' ?
                <BuildingIcon className="h-4 w-4 shrink-0 text-primary" /> :

                <CreditCardIcon className="h-4 w-4 shrink-0 text-primary" />
                }
                  <div>
                    <p className="text-xs text-ink-muted">Payment Method</p>
                    <p className="text-sm font-medium text-ink">
                      {PAYMENT_METHOD_LABEL[result.paymentMethod]}
                    </p>
                  </div>
                </div>
                {result.trackingNumber &&
              <div className="flex items-center gap-2.5">
                    <PackageSearchIcon className="h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-ink-muted">Tracking Number</p>
                      <p className="text-sm font-medium text-ink">
                        {result.trackingNumber}
                      </p>
                    </div>
                  </div>
              }
                {result.shippingAddress &&
              <div className="flex items-center gap-2.5">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-ink-muted">Delivery Address</p>
                      <p className="text-sm font-medium text-ink">
                        {result.shippingAddress.line1},{' '}
                        {result.shippingAddress.city}
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
                {result.items.map((item) =>
              <li
                key={item.productId}
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
                  PKR {PKR.format(result.total)}
                </span>
              </div>
            </div>
          </div>
        }
      </main>

      <Footer />
    </div>);

}
