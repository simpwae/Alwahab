import React from 'react';
import { TrophyIcon, SparklesIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TopUtilityBar } from '../components/layout/TopUtilityBar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { NewsletterModule } from '../components/NewsletterModule';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { FlashDeals } from '../components/home/FlashDeals';
import { ProductSection } from '../components/home/ProductSection';
import { PromoBand } from '../components/home/PromoBand';
import { WhyAlwahab } from '../components/home/WhyAlwahab';
import { useProducts } from '../context/ProductContext';
export function Home() {
  const { products } = useProducts();
  const flashDealProducts = products.filter(
    (p) => p.discountPct >= 20 && p.status === 'Active'
  );
  const bestSellers = [...products].
  filter((p) => p.status === 'Active').
  sort((a, b) => b.unitsSold - a.unitsSold).
  slice(0, 8);
  const newArrivals = products.
  filter((p) => p.ribbon === 'New' || p.status === 'Active').
  slice(0, 8);
  return (
    <div className="min-h-full w-full bg-white">
      <TopUtilityBar />
      <Header />
      <CartDrawer />

      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:gap-16">
        <HeroCarousel />
        <CategoryTiles />
        <FlashDeals products={flashDealProducts} />
        <ProductSection
          title="Best Sellers"
          subtitle="Loved by thousands of Alwahab customers"
          icon={<TrophyIcon className="h-5 w-5" />}
          viewAllHref="/category/all?sort=best-selling"
          products={bestSellers} />
        
        <ProductSection
          title="New Arrivals"
          subtitle="Fresh finds, just added to the store"
          icon={<SparklesIcon className="h-5 w-5" />}
          viewAllHref="/category/all?sort=new"
          products={newArrivals} />
        
        <PromoBand />
        <WhyAlwahab />
        <NewsletterModule />
      </main>

      <Footer />
    </div>);

}