import { Suspense } from 'react';
import { SearchResultsScreen } from '../../screens/SearchResultsScreen';

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsScreen />
    </Suspense>
  );
}
