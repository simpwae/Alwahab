import { Order } from '../types';

export type Granularity = 'daily' | 'monthly';

export function groupSales(orders: Order[], granularity: Granularity) {
  const buckets = new Map<string, number>();
  for (const o of orders) {
    const key = granularity === 'monthly' ? o.date.slice(0, 7) : o.date;
    buckets.set(key, (buckets.get(key) ?? 0) + o.total);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));
}

export function formatBucketLabel(date: string, granularity: Granularity) {
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day || 1);
  return parsed.toLocaleDateString(
    'en-US',
    granularity === 'monthly' ? { month: 'short', year: 'numeric' } : { month: 'short', day: 'numeric' }
  );
}
