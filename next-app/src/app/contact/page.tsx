import { TopUtilityBar } from '../../components/layout/TopUtilityBar';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/CartDrawer';
import { Breadcrumb } from '../../components/listing/Breadcrumb';
import { MailIcon, PhoneIcon, ClockIcon, MapPinIcon } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Alwahab',
};

export default function Contact() {
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Contact' }]} />

        <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Contact Us
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Questions about an order, a product, or anything else — we&apos;re happy to help.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="mailto:support@alwahab.pk"
            className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <MailIcon className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-ink">Email</span>
            <span className="text-sm text-ink-muted">support@alwahab.pk</span>
          </a>

          <a
            href="tel:+923255897659"
            className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 p-5 transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <PhoneIcon className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-ink">Phone</span>
            <span className="text-sm text-ink-muted">+92 325 5897659</span>
          </a>

          <div className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 p-5">
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-ink">Office</span>
            <span className="text-sm text-ink-muted">
              Shop # 14, Block B, National Market, Karkhano, Peshawar, Pakistan
            </span>
          </div>

          <div className="flex flex-col items-start gap-2 rounded-2xl border border-gray-100 p-5">
            <ClockIcon className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-ink">Hours</span>
            <span className="text-sm text-ink-muted">Mon–Sat, 10am–7pm PKT</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          Already placed an order? Check its status on our{' '}
          <a href="/track-order" className="font-medium text-primary hover:underline">
            Track Order
          </a>{' '}
          page.
        </p>
      </main>

      <Footer />
    </div>
  );
}
