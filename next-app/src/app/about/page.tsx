import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'About Us | Alwahab',
};

export default function About() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'About' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          About Alwahab
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          <p>
            Alwahab is a multi-category online store serving customers across
            Pakistan with electronics, accessories, home &amp; kitchen
            essentials, and everyday gadgets — all priced in PKR.
          </p>
          <p>
            We started with a simple goal: make it easy to find quality
            products at fair prices, backed by reliable delivery and a
            straightforward returns process. Every order is fulfilled with
            cash-on-delivery or card payment, and can be tracked from
            checkout through to your doorstep.
          </p>
          <p>
            Have a question we haven&apos;t answered? Reach out any time via
            our <a href="/contact" className="font-medium text-primary hover:underline">Contact page</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
