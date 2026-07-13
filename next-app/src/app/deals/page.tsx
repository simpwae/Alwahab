import { Suspense } from 'react';
import { CategoryListingScreen } from '../../screens/CategoryListingScreen';

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <CategoryListingScreen />
    </Suspense>
  );
}
