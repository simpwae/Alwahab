import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';

export const metadata = {
  title: 'About Alwahab — Pakistan Online Store',
  description: 'Learn about Alwahab (also known as Alwahab Mart) — Pakistan\'s trusted online store for electronics, home & kitchen, baby gear, and cosmetics.',
  keywords: ['about alwahab', 'alwahab mart', 'alwahab store pakistan', 'al wahab online store'],
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
            Alwahab — also known as Alwahab Mart — is a multi-category online
            store serving customers across Pakistan with electronics, home &amp;
            kitchen essentials, baby gear, and cosmetics — all priced in PKR.
          </p>
          <p>
            Alwahab was built with a simple goal: make it easy to find quality
            products at fair prices, backed by reliable delivery and a
            straightforward returns process. Every Alwahab order is fulfilled
            with cash-on-delivery or card payment, and can be tracked from
            checkout through to your doorstep.
          </p>
          <p>
            Whether you searched for &ldquo;alwahab&rdquo;, &ldquo;alwahab mart&rdquo;, or
            &ldquo;al wahab store&rdquo; — you&apos;re in the right place.
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
