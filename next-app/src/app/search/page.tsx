import { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchResultsScreen } from '../../screens/SearchResultsScreen';

export const metadata: Metadata = {
  title: 'Search Results',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsScreen />
    </Suspense>
  );
}
