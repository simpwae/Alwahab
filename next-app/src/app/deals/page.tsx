import { Suspense } from 'react';
import { Metadata } from 'next';
import { CategoryListingScreen } from '../../screens/CategoryListingScreen';

export const metadata: Metadata = {
  title: "Today's Deals",
  description: 'Shop the best daily deals and discounts on electronics, home & kitchen, and baby gear at Alwahab.',
  alternates: {
    canonical: '/deals',
  },
  openGraph: {
    title: "Today's Deals | Alwahab",
    description: 'Shop the best daily deals and discounts at Alwahab.',
    url: '/deals',
  },
};

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <CategoryListingScreen />
    </Suspense>
  );
}
