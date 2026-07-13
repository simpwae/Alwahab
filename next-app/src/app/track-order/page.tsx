import { Suspense } from 'react';
import { TrackOrderScreen } from '../../screens/TrackOrderScreen';

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderScreen />
    </Suspense>
  );
}
