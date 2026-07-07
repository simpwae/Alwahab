import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  MessageCircleIcon,
  CreditCardIcon } from
'lucide-react';
import { Logo } from './Logo';
const QUICK_LINKS = [
{
  label: 'Home',
  href: '/'
},
{
  label: 'About',
  href: '/about'
},
{
  label: 'Contact',
  href: '/contact'
},
{
  label: 'FAQs',
  href: '/faqs'
},
{
  label: 'Track Order',
  href: '/track-order'
},
{
  label: 'Return Policy',
  href: '/return-policy'
}];

const CATEGORIES = [
{
  label: 'Electronics',
  slug: 'electronics'
},
{
  label: 'Accessories',
  slug: 'accessories'
},
{
  label: 'Home & Kitchen',
  slug: 'home-kitchen'
},
{
  label: 'Gadgets',
  slug: 'gadgets'
},
{
  label: 'Deals',
  slug: 'deals'
}];

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Alwahab is your trusted destination for electronics, accessories,
            home &amp; kitchen, gadgets, and lifestyle products — quality you
            can count on.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-muted shadow-soft transition-colors hover:text-primary">
              
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-muted shadow-soft transition-colors hover:text-primary">
              
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-muted shadow-soft transition-colors hover:text-primary">
              
              <MessageCircleIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="font-display text-sm font-semibold text-ink">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) =>
            <li key={link.label}>
                <Link
                to={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-primary">
                
                  {link.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h3 className="font-display text-sm font-semibold text-ink">
            Categories
          </h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((cat) =>
            <li key={cat.slug}>
                <Link
                to={cat.slug === 'deals' ? '/deals' : `/category/${cat.slug}`}
                className="text-sm text-ink-muted transition-colors hover:text-primary">
                
                  {cat.label}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-sm font-semibold text-ink">
            Newsletter
          </h3>
          <p className="mt-4 text-sm text-ink-muted">
            Get new arrivals &amp; exclusive deals first.
          </p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}>
            
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Your email"
              className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark">
              
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-4 py-5 text-xs text-ink-muted sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 Alwahab. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1">
              <CreditCardIcon className="h-3.5 w-3.5" /> COD
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 font-semibold italic text-[#1A1F71]">
              Visa
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 font-semibold text-[#EB001B]">
              Mastercard
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 font-semibold text-[#635BFF]">
              Stripe
            </span>
          </div>
        </div>
      </div>
    </footer>);

}