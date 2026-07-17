import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'Return Policy | Alwahab',
};

export default function ReturnPolicy() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Return Policy' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Return Policy
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section>
            <h2 className="font-display text-base font-semibold text-ink">Return Window</h2>
            <p className="mt-1">
              Most items can be returned within 7 days of delivery, provided they&apos;re unused,
              in their original packaging, and accompanied by proof of purchase (your order ID).
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Non-Returnable Items</h2>
            <p className="mt-1">
              Items marked as final sale, personal care products, and items damaged through
              misuse after delivery are not eligible for return.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">How to Start a Return</h2>
            <p className="mt-1">
              Contact us at{' '}
              <a href="mailto:support@alwahab.pk" className="font-medium text-primary hover:underline">
                support@alwahab.pk
              </a>{' '}
              with your order ID and reason for return. We&apos;ll confirm pickup or drop-off
              details within 1–2 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Refunds</h2>
            <p className="mt-1">
              Once we receive and inspect the returned item, refunds are issued to the original
              payment method within 5–7 business days. Cash-on-delivery orders are refunded via
              bank transfer.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
