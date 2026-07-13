"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LockIcon } from
'lucide-react';
import { Header } from '../../components/layout/Header';
import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { FormField } from '../../components/ui/FormField';
import { EmptyState } from '../../components/states/EmptyState';
import { PaymentMethodSelector } from '../../components/checkout/PaymentMethodSelector';
import { BankTransferPanel } from '../../components/checkout/BankTransferPanel';
import {
  StripeCardForm,
  CardFormValues } from
'../../components/checkout/StripeCardForm';
import { CheckoutOrderSummary } from '../../components/checkout/CheckoutOrderSummary';
import { useCart } from '../../context/CartContext';
import { useOrders, generateOrderId } from '../../context/OrderContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useCoupons } from '../../context/CouponContext';
import { findValidCoupon, calculateDiscount } from '../../data/sampleCoupons';
import { Order, PaymentMethod } from '../../types';
export interface ContactShippingValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}
export type ContactShippingErrors = Partial<
  Record<keyof ContactShippingValues, string>>;

const INITIAL_CONTACT: ContactShippingValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: ''
};
export function validateContact(values: ContactShippingValues): ContactShippingErrors {
  const errors: ContactShippingErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\d+\-\s]{7,15}$/.test(values.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }
  if (!values.address.trim()) errors.address = 'Street address is required.';
  if (!values.city.trim()) errors.city = 'City is required.';
  return errors;
}
function validateCard(values: CardFormValues) {
  const errors: Partial<Record<keyof CardFormValues, string>> = {};
  const digits = values.cardNumber.replace(/\s/g, '');
  if (digits.length !== 16)
  errors.cardNumber = 'Enter a valid 16-digit card number.';
  if (!values.cardName.trim()) errors.cardName = 'Name on card is required.';
  if (!/^\d{2}\/\d{2}$/.test(values.expiry)) {
    errors.expiry = 'Enter expiry as MM/YY.';
  }
  if (values.cvc.length < 3) errors.cvc = 'Enter a valid CVC.';
  return errors;
}
export default function Checkout() {
  const { lines, subtotal, clearCart, appliedCode } = useCart();
  const { addOrder } = useOrders();
  const { settings } = useStoreSettings();
  const { coupons } = useCoupons();
  const router = useRouter();
  const [contact, setContact] = useState<ContactShippingValues>(INITIAL_CONTACT);
  const [contactErrors, setContactErrors] = useState<ContactShippingErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactShippingValues, boolean>>>(
    {});
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState<string | undefined>(
    undefined
  );
  const [cardValues, setCardValues] = useState<CardFormValues>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [cardErrors, setCardErrors] = useState<
    Partial<Record<keyof CardFormValues, string>>>(
    {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const discount = appliedCode ?
  calculateDiscount(
    findValidCoupon(appliedCode, subtotal, coupons).coupon!,
    subtotal
  ) :
  0;
  const shipping =
  subtotal - discount >= settings.shipping.freeShippingThreshold ?
  0 :
  settings.shipping.flatRate;
  const total = Math.max(0, subtotal - discount) + (lines.length ? shipping : 0);
  const handleContactChange = (
  field: keyof ContactShippingValues,
  value: string) =>
  {
    setContact((prev) => ({
      ...prev,
      [field]: value
    }));
    if (touched[field]) {
      setContactErrors(
        validateContact({
          ...contact,
          [field]: value
        })
      );
    }
  };
  const handleContactBlur = (field: keyof ContactShippingValues) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));
    setContactErrors(validateContact(contact));
  };
  const handleCardChange = (field: keyof CardFormValues, value: string) => {
    setCardValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handlePlaceOrder = () => {
    const contactValidation = validateContact(contact);
    setContactErrors(contactValidation);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true
    });
    let hasError = Object.keys(contactValidation).length > 0;
    if (paymentMethod === 'BankTransfer' && !receiptFile) {
      setReceiptError('Please upload your payment receipt to continue.');
      hasError = true;
    } else {
      setReceiptError(undefined);
    }
    if (paymentMethod === 'Stripe') {
      const cardValidation = validateCard(cardValues);
      setCardErrors(cardValidation);
      if (Object.keys(cardValidation).length > 0) hasError = true;
    }
    if (hasError) return;
    setIsSubmitting(true);
    const paymentStatus =
    paymentMethod === 'Stripe' ?
    'Paid' :
    paymentMethod === 'BankTransfer' ?
    'AwaitingVerification' :
    'Pending';
    const order: Order = {
      id: generateOrderId(),
      date: new Date().toISOString().slice(0, 10),
      customer: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      shippingAddress: {
        line1: contact.address,
        city: contact.city
      },
      couponCode: appliedCode ?? undefined,
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        image: l.image,
        price: l.price,
        qty: l.qty
      })),
      subtotal,
      discount,
      shipping: lines.length ? shipping : 0,
      total,
      paymentMethod,
      paymentStatus,
      fulfillmentStatus: 'Pending',
      receiptImage: receiptFile ? URL.createObjectURL(receiptFile) : undefined
    };
    setTimeout(() => {
      addOrder(order);
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-confirmation/${order.id}`);
    }, 700);
  };
  if (lines.length === 0) {
    return (
      <div className="min-h-full w-full bg-white">
        <TopUtilityBar />
        <Header />
        <CartDrawer />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <EmptyState
            title="Your cart is empty"
            description="Add some products to your cart before proceeding to checkout."
            actionLabel="Continue Shopping"
            onAction={() => router.push('/')} />

        </main>
        <Footer />
      </div>);

  }
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb
          items={[
          {
            label: 'Cart',
            href: '/cart'
          },
          {
            label: 'Checkout'
          }]
          } />

        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark">

            <ArrowLeftIcon className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-6">
            <section className="rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display text-base font-bold text-ink">
                Contact & Shipping
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    label="Full Name"
                    id="full-name"
                    placeholder="Your full name"
                    leadingIcon={<UserIcon className="h-4 w-4" />}
                    value={contact.fullName}
                    onChange={(e) =>
                    handleContactChange('fullName', e.target.value)
                    }
                    onBlur={() => handleContactBlur('fullName')}
                    error={
                    touched.fullName ? contactErrors.fullName : undefined
                    } />

                </div>
                <FormField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  leadingIcon={<MailIcon className="h-4 w-4" />}
                  value={contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  onBlur={() => handleContactBlur('email')}
                  error={touched.email ? contactErrors.email : undefined}
                  hint="Used to send order updates and for order tracking." />

                <FormField
                  label="Phone"
                  id="phone"
                  placeholder="03XX-XXXXXXX"
                  leadingIcon={<PhoneIcon className="h-4 w-4" />}
                  value={contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  onBlur={() => handleContactBlur('phone')}
                  error={touched.phone ? contactErrors.phone : undefined} />

                <div className="sm:col-span-2">
                  <FormField
                    label="Street Address"
                    id="address"
                    placeholder="House / street / area"
                    leadingIcon={<MapPinIcon className="h-4 w-4" />}
                    value={contact.address}
                    onChange={(e) =>
                    handleContactChange('address', e.target.value)
                    }
                    onBlur={() => handleContactBlur('address')}
                    error={touched.address ? contactErrors.address : undefined} />

                </div>
                <FormField
                  label="City"
                  id="city"
                  placeholder="e.g. Lahore"
                  value={contact.city}
                  onChange={(e) => handleContactChange('city', e.target.value)}
                  onBlur={() => handleContactBlur('city')}
                  error={touched.city ? contactErrors.city : undefined} />

              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    Create an account
                  </p>
                  <p className="text-xs text-ink-muted">
                    Save your details for faster checkout next time. Optional.
                  </p>
                </div>
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={() => setCreateAccount((v) => !v)}
                    className="peer sr-only" />

                  <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary" />
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                </label>
              </div>

              {createAccount &&
              <div className="mt-3">
                  <FormField
                  label="Create Password"
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  leadingIcon={<LockIcon className="h-4 w-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />

                </div>
              }
            </section>

            <section className="rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display text-base font-bold text-ink">
                Payment Method
              </h2>
              <div className="mt-4">
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod} />

              </div>

              {paymentMethod === 'BankTransfer' &&
              <BankTransferPanel
                receiptFile={receiptFile}
                onReceiptChange={setReceiptFile}
                error={receiptError} />

              }

              {paymentMethod === 'Stripe' &&
              <StripeCardForm
                values={cardValues}
                errors={cardErrors}
                onChange={handleCardChange} />

              }
            </section>
          </div>

          <div className="w-full shrink-0 lg:w-96 lg:sticky lg:top-24">
            <CheckoutOrderSummary
              lines={lines}
              subtotal={subtotal}
              discount={discount}
              shipping={lines.length ? shipping : 0}
              total={total}
              couponCode={appliedCode}
              submitLabel="Place Order"
              isSubmitting={isSubmitting}
              onSubmit={handlePlaceOrder} />

          </div>
        </div>
      </main>

      <Footer />
    </div>);

}
