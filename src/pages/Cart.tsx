import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
  TagIcon,
  XIcon,
  ArrowRightIcon,
  ArrowLeftIcon } from
'lucide-react';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Breadcrumb } from '../components/listing/Breadcrumb';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/states/EmptyState';
import { useCart } from '../context/CartContext';
import { useCoupons } from '../context/CouponContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { findValidCoupon, calculateDiscount } from '../data/sampleCoupons';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
export function Cart() {
  const { lines, updateQty, removeFromCart, subtotal } = useCart();
  const { coupons } = useCoupons();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const discount = appliedCode ?
  calculateDiscount(
    findValidCoupon(appliedCode, subtotal, coupons).coupon!,
    subtotal
  ) :
  0;
  const shipping =
  lines.length === 0 ?
  0 :
  subtotal - discount >= settings.shipping.freeShippingThreshold ?
  0 :
  settings.shipping.flatRate;
  const total = Math.max(0, subtotal - discount) + shipping;
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const { coupon, error } = findValidCoupon(promoInput, subtotal, coupons);
    if (error || !coupon) {
      setPromoError(error ?? 'Invalid promo code.');
      setAppliedCode(null);
      return;
    }
    setAppliedCode(coupon.code);
    setPromoError(null);
  };
  const handleRemovePromo = () => {
    setAppliedCode(null);
    setPromoInput('');
    setPromoError(null);
  };
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb
          items={[
          {
            label: 'Shopping Cart'
          }]
          } />
        
        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Shopping Cart
        </h1>

        {lines.length === 0 ?
        <div className="mt-8">
            <EmptyState
            icon={<ShoppingBagIcon className="h-8 w-8" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Start exploring our latest deals and best sellers."
            actionLabel="Continue Shopping"
            onAction={() => navigate('/')} />
          
          </div> :

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 rounded-2xl border border-gray-100">
              <ul className="divide-y divide-gray-100">
                {lines.map((line) =>
              <li key={line.productId} className="flex gap-4 p-4 sm:p-5">
                    <Link
                  to={`/product/${line.productId}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 sm:h-24 sm:w-24">
                  
                      <img
                    src={line.image}
                    alt={line.name}
                    className="h-full w-full object-cover" />
                  
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                      to={`/product/${line.productId}`}
                      className="line-clamp-2 text-sm font-medium text-ink hover:text-primary sm:text-base">
                      
                          {line.name}
                        </Link>
                        <button
                      type="button"
                      aria-label={`Remove ${line.name} from cart`}
                      onClick={() => removeFromCart(line.productId)}
                      className="shrink-0 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600">
                      
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="mt-1 font-display text-base font-bold text-ink sm:text-lg">
                        PKR {PKR.format(line.price)}
                      </span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                        type="button"
                        aria-label={`Decrease quantity of ${line.name}`}
                        onClick={() =>
                        updateQty(line.productId, line.qty - 1)
                        }
                        disabled={line.qty <= 1}
                        className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                        
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {line.qty}
                          </span>
                          <button
                        type="button"
                        aria-label={`Increase quantity of ${line.name}`}
                        onClick={() =>
                        updateQty(line.productId, line.qty + 1)
                        }
                        disabled={line.qty >= line.stockQty}
                        className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                        
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-ink">
                          PKR {PKR.format(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
              )}
              </ul>

              <div className="p-4 sm:p-5">
                <Link
                to="/"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark">
                
                  <ArrowLeftIcon className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="w-full shrink-0 lg:w-80">
              <div className="rounded-2xl border border-gray-100 bg-surface p-5">
                <h2 className="font-display text-base font-bold text-ink">
                  Order Summary
                </h2>

                <form onSubmit={handleApplyPromo} className="mt-4">
                  {appliedCode ?
                <div className="flex items-center justify-between rounded-xl bg-primary-50 px-3.5 py-2.5 text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-primary">
                        <TagIcon className="h-4 w-4" />
                        {appliedCode} applied
                      </span>
                      <button
                    type="button"
                    onClick={handleRemovePromo}
                    aria-label="Remove promo code"
                    className="rounded-full p-1 text-primary hover:bg-primary/15">
                    
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div> :

                <div>
                      <label htmlFor="promo-code" className="sr-only">
                        Promo code
                      </label>
                      <div className="flex gap-2">
                        <input
                      id="promo-code"
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(null);
                      }}
                      placeholder="Promo code"
                      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 ${promoError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-primary/20'}`} />
                    
                        <Button type="submit" variant="secondary" size="md">
                          Apply
                        </Button>
                      </div>
                      {promoError &&
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                          {promoError}
                        </p>
                  }
                    </div>
                }
                </form>

                <dl className="mt-5 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Subtotal</dt>
                    <dd className="font-medium text-ink">
                      PKR {PKR.format(subtotal)}
                    </dd>
                  </div>
                  {discount > 0 &&
                <div className="flex justify-between">
                      <dt className="text-ink-muted">Discount</dt>
                      <dd className="font-medium text-primary">
                        -PKR {PKR.format(discount)}
                      </dd>
                    </div>
                }
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Shipping</dt>
                    <dd className="font-medium text-ink">
                      {shipping === 0 ? 'Free' : `PKR ${PKR.format(shipping)}`}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2.5 text-base">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-display font-bold text-ink">
                      PKR {PKR.format(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                variant="accent"
                size="lg"
                fullWidth
                className="mt-5"
                icon={<ArrowRightIcon className="h-4 w-4" />}
                onClick={() =>
                navigate('/checkout', {
                  state: {
                    promoCode: appliedCode,
                    discount
                  }
                })
                }>
                
                  Proceed to Checkout
                </Button>

                {shipping > 0 &&
              <p className="mt-3 text-center text-xs text-ink-muted">
                    Add PKR{' '}
                    {PKR.format(
                  settings.shipping.freeShippingThreshold - (
                  subtotal - discount)
                )}{' '}
                    more for free shipping
                  </p>
              }
              </div>
            </div>
          </div>
        }
      </main>

      <Footer />
    </div>);

}