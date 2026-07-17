import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { ChevronDownIcon } from 'lucide-react';

export const metadata = {
  title: 'FAQs | Alwahab',
};

const FAQS = [
  {
    q: 'What payment methods do you accept?',
    a: 'Cash on Delivery (COD) and card payment (Visa, Mastercard) via Stripe.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders arrive within 3–5 business days, depending on your city. You can track any order in real time from the Track Order page.',
  },
  {
    q: 'Can I return a product?',
    a: 'Yes — see our Return Policy page for the full window and conditions. Most items can be returned within 7 days of delivery.',
  },
  {
    q: 'Do you ship across all of Pakistan?',
    a: 'Yes, we deliver nationwide. Shipping cost is calculated at checkout based on your city and order total.',
  },
  {
    q: 'How do I track my order?',
    a: 'Use the Track Order page with your order ID and the email or phone number used at checkout, or check your order history from your account if you were logged in.',
  },
  {
    q: 'How do I apply a coupon code?',
    a: 'Enter your coupon code in the cart before checking out — the discount is applied immediately if the code is valid.',
  },
];

export default function Faqs() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'FAQs' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Frequently Asked Questions
        </h1>

        <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-100">
          {FAQS.map((item) => (
            <details key={item.q} className="group p-5 open:bg-surface/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-ink sm:text-base">
                {item.q}
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
