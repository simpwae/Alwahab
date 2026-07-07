import React from 'react';
import { CartLine } from '../../context/CartContext';
import { Button } from '../ui/Button';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
interface CheckoutOrderSummaryProps {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string | null;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}
export function CheckoutOrderSummary({
  lines,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  submitLabel,
  isSubmitting,
  onSubmit
}: CheckoutOrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-surface p-5">
      <h2 className="font-display text-base font-bold text-ink">
        Order Summary
      </h2>

      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {lines.map((line) =>
        <li key={line.productId} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200">
              <img
              src={line.image}
              alt={line.name}
              className="h-full w-full object-cover" />
            
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                {line.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium text-ink">
                {line.name}
              </p>
              <p className="text-xs text-ink-muted">
                PKR {PKR.format(line.price)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-ink">
              PKR {PKR.format(line.price * line.qty)}
            </span>
          </li>
        )}
      </ul>

      <dl className="mt-4 space-y-2.5 border-t border-gray-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="font-medium text-ink">PKR {PKR.format(subtotal)}</dd>
        </div>
        {discount > 0 &&
        <div className="flex justify-between">
            <dt className="text-ink-muted">
              Discount {couponCode ? `(${couponCode})` : ''}
            </dt>
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
        onClick={onSubmit}
        disabled={isSubmitting}>
        
        {isSubmitting ? 'Placing Order…' : submitLabel}
      </Button>
    </div>);

}