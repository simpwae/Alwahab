import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'Privacy Policy | Alwahab',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Information We Collect
            </h2>
            <p className="mt-1">
              When you create an account, place an order, or contact us, we collect details such
              as your name, email address, phone number, delivery address, and order history.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              How We Use Your Information
            </h2>
            <p className="mt-1">
              We use this information to process and deliver your orders, provide customer
              support, send order updates, and — where you&apos;ve opted in — share news about
              new arrivals and deals.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Cookies</h2>
            <p className="mt-1">
              Our site uses cookies to keep you signed in, remember your cart, and understand how
              the site is used so we can improve it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">
              Sharing With Third Parties
            </h2>
            <p className="mt-1">
              We share only the information necessary with delivery couriers and payment
              processors to fulfil your order. We do not sell your personal information to
              anyone.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Data Security</h2>
            <p className="mt-1">
              We take reasonable technical and organizational measures to protect your
              information from unauthorized access, loss, or misuse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-semibold text-ink">Your Rights</h2>
            <p className="mt-1">
              You can request access to, correction of, or deletion of your personal information
              at any time by contacting us at{' '}
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
