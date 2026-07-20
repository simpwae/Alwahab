import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'Shipping Policy | Alwahab',
};

export default function ShippingPolicy() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Shipping Policy' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Shipping Policy
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section>
            <h2 className="font-display text-base font-semibold text-ink">Delivery Areas</h2>
            <p className="mt-1">
              We deliver nationwide across Pakistan from our office in Peshawar.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Delivery Times</h2>
            <p className="mt-1">
              Most orders are delivered within 3–7 business days of confirmation, depending on
              your location. Remote areas may take slightly longer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Shipping Charges</h2>
            <p className="mt-1">
              A flat shipping rate applies to orders below our free-shipping threshold; orders
              above that threshold ship free. Exact rates are shown at checkout before you
              confirm your order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Order Tracking</h2>
            <p className="mt-1">
              Once your order ships, you can check its status anytime on our{' '}
              <a href="/track-order" className="font-medium text-primary hover:underline">
                Track Order
              </a>{' '}
              page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Delays &amp; Exceptions
            </h2>
            <p className="mt-1">
              Occasionally weather, courier disruptions, or high demand may delay delivery. We&apos;ll
              notify you if your order is significantly delayed.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
