import { Suspense } from 'react';
import { Metadata } from 'next';
import { CategoryListingScreen } from '../../../screens/CategoryListingScreen';
import { slugToCategory } from '../../../utils/productFilters';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slugToCategory(slug) || 'Category';

  return {
    title: `${categoryName} Products`,
    description: `Shop the latest ${categoryName} products at Alwahab with amazing deals and fast delivery.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${categoryName} Products | Alwahab`,
      description: `Shop the latest ${categoryName} products at Alwahab.`,
      url: `/category/${slug}`,
    },
  };
}

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <CategoryListingScreen />
    </Suspense>
  );
}
