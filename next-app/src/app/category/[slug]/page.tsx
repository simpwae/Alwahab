import { Suspense } from 'react';
import { CategoryListingScreen } from '../../../screens/CategoryListingScreen';

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <CategoryListingScreen />
    </Suspense>
  );
}
