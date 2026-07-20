import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'Terms & Conditions | Alwahab',
};

export default function Terms() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Terms &amp; Conditions
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Acceptance of Terms
            </h2>
            <p className="mt-1">
              By accessing or using the Alwahab website, you agree to be bound by these Terms
              &amp; Conditions. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Use of the Site</h2>
            <p className="mt-1">
              You agree to use this site only for lawful purposes and to provide accurate
              information when creating an account or placing an order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Orders &amp; Pricing</h2>
            <p className="mt-1">
              All prices are listed in Pakistani Rupees (PKR) and are subject to change without
              notice. Orders are subject to product availability and confirmation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Payment Methods</h2>
            <p className="mt-1">
              We accept Cash on Delivery, Visa, Mastercard, and Stripe, as well as direct bank
              transfer where offered at checkout.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Shipping &amp; Returns
            </h2>
            <p className="mt-1">
              Delivery timelines and charges are described in our{' '}
              <a href="/shipping-policy" className="font-medium text-primary hover:underline">
                Shipping Policy
              </a>
              . Return and refund terms are described in our{' '}
              <a href="/return-policy" className="font-medium text-primary hover:underline">
                Return Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Limitation of Liability
            </h2>
            <p className="mt-1">
              Alwahab is not liable for indirect or incidental damages arising from the use of
              this site or the products purchased through it, to the extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Governing Law</h2>
            <p className="mt-1">
              These Terms are governed by the laws of Pakistan, and any disputes will be subject
              to the exclusive jurisdiction of the courts of Pakistan.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Contact</h2>
            <p className="mt-1">
              Questions about these Terms? Reach us at{' '}
              <a href="mailto:support@alwahab.pk" className="font-medium text-primary hover:underline">
                support@alwahab.pk
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
