import React from 'react';
import { CreditCardIcon, LockIcon } from 'lucide-react';
import { FormField } from '../ui/FormField';
export interface CardFormValues {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}
interface StripeCardFormProps {
  values: CardFormValues;
  errors: Partial<Record<keyof CardFormValues, string>>;
  onChange: (field: keyof CardFormValues, value: string) => void;
}
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
export function StripeCardForm({
  values,
  errors,
  onChange
}: StripeCardFormProps) {
  return (
    <div className="mt-4 space-y-4 rounded-xl bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
        <LockIcon className="h-3.5 w-3.5" />
        Payments are securely processed by Stripe.
      </div>

      <FormField
        label="Card Number"
        id="card-number"
        placeholder="1234 5678 9012 3456"
        inputMode="numeric"
        leadingIcon={<CreditCardIcon className="h-4 w-4" />}
        value={values.cardNumber}
        onChange={(e) =>
        onChange('cardNumber', formatCardNumber(e.target.value))
        }
        error={errors.cardNumber} />
      

      <FormField
        label="Name on Card"
        id="card-name"
        placeholder="Full name as on card"
        value={values.cardName}
        onChange={(e) => onChange('cardName', e.target.value)}
        error={errors.cardName} />
      

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Expiry Date"
          id="card-expiry"
          placeholder="MM/YY"
          inputMode="numeric"
          value={values.expiry}
          onChange={(e) => onChange('expiry', formatExpiry(e.target.value))}
          error={errors.expiry} />
        
        <FormField
          label="CVC"
          id="card-cvc"
          placeholder="123"
          inputMode="numeric"
          maxLength={4}
          value={values.cvc}
          onChange={(e) =>
          onChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))
          }
          error={errors.cvc} />
        
      </div>
    </div>);

}