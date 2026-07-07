import React, { useState } from 'react';
import { ShoppingBagIcon, ImageOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/ProductCard';
import { NewsletterModule } from '../components/NewsletterModule';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ProductGridSkeleton } from '../components/states/Skeleton';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { useCart } from '../context/CartContext';
import { sampleProducts } from '../data/sampleProducts';
function Section({
  id,
  title,
  description,
  children





}: {id: string;title: string;description?: string;children: React.ReactNode;}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-gray-100 py-12 first:border-t-0 first:pt-0">
      
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
          {title}
        </h2>
        {description &&
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
            {description}
          </p>
        }
      </div>
      {children}
    </section>);

}
function ColorSwatch({
  name,
  hex,
  textClass = 'text-white'




}: {name: string;hex: string;textClass?: string;}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-soft">
      <div
        className={`flex h-20 items-end p-3 ${textClass}`}
        style={{
          backgroundColor: hex
        }}>
        
        <span className="text-xs font-semibold">{hex}</span>
      </div>
      <div className="bg-white px-3 py-2">
        <span className="text-sm font-medium text-ink">{name}</span>
      </div>
    </div>);

}
const NAV_ITEMS = [
{
  id: 'colors',
  label: 'Colors'
},
{
  id: 'typography',
  label: 'Typography'
},
{
  id: 'buttons',
  label: 'Buttons'
},
{
  id: 'badges',
  label: 'Badges'
},
{
  id: 'header-footer',
  label: 'Header & Footer'
},
{
  id: 'product-cards',
  label: 'Product Cards'
},
{
  id: 'cart',
  label: 'Cart Drawer'
},
{
  id: 'newsletter',
  label: 'Newsletter'
},
{
  id: 'states',
  label: 'State Kit'
},
{
  id: 'forms',
  label: 'Form Fields'
}];

export function StyleGuide() {
  const { openCart } = useCart();
  const [showEmpty, setShowEmpty] = useState(true);
  const [fieldError, setFieldError] = useState(
    'Please enter a valid email address.'
  );
  const outOfStockProduct = sampleProducts.find(
    (p) => p.status === 'OutOfStock'
  )!;
  const lowStockProduct = sampleProducts.find(
    (p) => p.stockQty > 0 && p.stockQty <= p.lowStockThreshold
  )!;
  const newRibbonProduct = sampleProducts.find((p) => p.ribbon === 'New')!;
  const bestSellerProduct = sampleProducts.find(
    (p) => p.ribbon === 'BestSeller'
  )!;
  const plainProduct =
  sampleProducts.find((p) => p.discountPct === 0 && p.status === 'Active') ??
  sampleProducts[6];
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Style guide sections"
          className="sticky top-24 hidden h-max w-48 shrink-0 lg:block">
          
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            On this page
          </span>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) =>
            <li key={item.id}>
                <a
                href={`#${item.id}`}
                className="block rounded-lg px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface hover:text-primary">
                
                  {item.label}
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <div className="mb-10">
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Design System
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Alwahab Style Guide
            </h1>
            <p className="mt-2 max-w-2xl text-ink-muted">
              Reference for brand tokens and reusable components used across the
              Alwahab storefront. Clean, premium, mobile-first.
            </p>
          </div>

          <Section
            id="colors"
            title="Colors"
            description="Primary teal for trust and structure. Amber-coral reserved for discounts, sale, and primary CTAs.">
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <ColorSwatch name="Primary" hex="#0E7C6B" />
              <ColorSwatch name="Primary Dark" hex="#0B6255" />
              <ColorSwatch name="Accent / Sale" hex="#F97316" />
              <ColorSwatch name="Ink (Text)" hex="#1A1A1A" />
              <ColorSwatch
                name="Soft Gray"
                hex="#F7F8FA"
                textClass="text-ink" />
              
            </div>
          </Section>

          <Section
            id="typography"
            title="Typography"
            description="Poppins for display / headings, Inter for body text.">
            
            <div className="space-y-4 rounded-2xl border border-gray-100 p-6 shadow-soft">
              <p className="font-display text-4xl font-extrabold text-ink">
                Heading 1 / Poppins 800
              </p>
              <p className="font-display text-3xl font-bold text-ink">
                Heading 2 / Poppins 700
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                Heading 3 / Poppins 600
              </p>
              <p className="text-base text-ink">
                Body text / Inter 400 — Discover premium electronics,
                accessories, home &amp; kitchen essentials, gadgets, and
                lifestyle goods.
              </p>
              <p className="text-sm text-ink-muted">
                Muted secondary text / Inter 400
              </p>
            </div>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            description="Primary teal for main actions, amber accent reserved for CTAs & sale-driven actions.">
            
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Shop the Sale</Button>
              <Button variant="danger-ghost">Remove Item</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Section>

          <Section
            id="badges"
            title="Status Badges"
            description="Shared color convention across customer and admin surfaces.">
            
            <div className="flex flex-wrap gap-3">
              <StatusBadge label="Active" variant="success" />
              <StatusBadge label="Draft" variant="neutral" />
              <StatusBadge label="Out of Stock" variant="danger" />
              <StatusBadge label="Awaiting Verification" variant="warning" />
              <StatusBadge label="Confirmed" variant="info" />
              <StatusBadge label="Sale" variant="accent" />
            </div>
          </Section>

          <Section
            id="header-footer"
            title="Header & Footer"
            description="Sticky header with mega-menu, live search suggestions, and utility bar. Footer with quick links, categories, and newsletter.">
            
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-soft">
                <div className="border-b border-gray-100 bg-surface px-4 py-2 text-xs font-medium text-ink-muted">
                  Header (embedded above the page too)
                </div>
                <div className="pointer-events-none opacity-90">
                  <TopUtilityBar />
                  <Header />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-soft">
                <div className="border-b border-gray-100 bg-surface px-4 py-2 text-xs font-medium text-ink-muted">
                  Footer
                </div>
                <Footer />
              </div>
            </div>
          </Section>

          <Section
            id="product-cards"
            title="Product Card"
            description="Square image with hover swap, discount badge, ribbon, pricing block, social proof, rating, and cart/wishlist actions.">
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <ProductCard product={plainProduct} />
              <ProductCard product={sampleProducts[0]} wishlisted />
              <ProductCard product={lowStockProduct} />
              <ProductCard product={newRibbonProduct} />
              <ProductCard product={bestSellerProduct} />
              <ProductCard product={outOfStockProduct} />
            </div>
          </Section>

          <Section
            id="cart"
            title="Cart Drawer"
            description="Slide-in cart with quantity steppers, subtotal, and checkout CTA.">
            
            <Button
              variant="primary"
              icon={<ShoppingBagIcon className="h-4 w-4" />}
              onClick={openCart}>
              
              Open Cart Drawer
            </Button>
            <p className="mt-3 text-sm text-ink-muted">
              Add a product above to populate the cart, then open the drawer.
              Toasts confirm each addition.
            </p>
          </Section>

          <Section id="newsletter" title="Newsletter Module">
            <NewsletterModule />
          </Section>

          <Section
            id="states"
            title="State Kit"
            description="Loading, empty, and error states used across every list/data screen.">
            
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">
                  Loading — Skeleton
                </h3>
                <ProductGridSkeleton count={4} />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">
                  Empty State
                </h3>
                {showEmpty ?
                <EmptyState
                  icon={<ImageOffIcon className="h-8 w-8" />}
                  title="No products found"
                  description="Try adjusting your filters or search terms to find what you're looking for."
                  actionLabel="Clear Filters"
                  onAction={() => {
                    setShowEmpty(false);
                    toast.success('Filters cleared');
                    setTimeout(() => setShowEmpty(true), 1500);
                  }} /> :


                <div className="rounded-2xl border border-dashed border-gray-200 bg-surface px-6 py-14 text-center text-sm text-ink-muted">
                    Filters cleared — results would repopulate here.
                  </div>
                }
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">
                  Error State
                </h3>
                <ErrorState onRetry={() => toast.message('Retrying…')} />
              </div>
            </div>
          </Section>

          <Section id="forms" title="Form Fields & Inline Validation">
            <div className="grid max-w-md gap-4">
              <FormField
                id="demo-name"
                label="Full Name"
                placeholder="e.g. Ayesha Khan" />
              
              <FormField
                id="demo-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                defaultValue="not-an-email"
                error={fieldError}
                onChange={() => setFieldError('')} />
              
              <FormField
                id="demo-hint"
                label="Phone Number"
                placeholder="03XX-XXXXXXX"
                hint="We'll only use this to confirm your order." />
              
            </div>
          </Section>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <NewsletterModule />
        </div>
      </div>
      <Footer />
    </div>);

}