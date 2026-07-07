import React, { useEffect, useState, useRef } from 'react';
import { FlameIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
interface FlashDealsProps {
  products: Product[];
}
function getEndOfDeal(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(now.getHours() + 6, now.getMinutes() + 42, 0, 0);
  return end.getTime();
}
function useCountdown(targetTime: number) {
  const [remaining, setRemaining] = useState(
    Math.max(0, targetTime - Date.now())
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, targetTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60));
  const seconds = Math.floor(remaining % (1000 * 60) / 1000);
  return {
    hours,
    minutes,
    seconds
  };
}
function TimeBlock({ value, label }: {value: number;label: string;}) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-base">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-muted">
        {label}
      </span>
    </div>);

}
export function FlashDeals({ products }: FlashDealsProps) {
  const [targetTime] = useState(getEndOfDeal);
  const { hours, minutes, seconds } = useCountdown(targetTime);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({
      left: dir * 320,
      behavior: 'smooth'
    });
  };
  return (
    <section aria-label="Flash deals">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-dark">
            <FlameIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Flash Deals
            </h2>
            <p className="text-xs text-ink-muted">
              Ends soon — grab them before they're gone
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5"
            role="timer"
            aria-label="Time remaining for flash deals">
            
            <TimeBlock value={hours} label="Hrs" />
            <span className="pb-4 font-bold text-ink-muted">:</span>
            <TimeBlock value={minutes} label="Min" />
            <span className="pb-4 font-bold text-ink-muted">:</span>
            <TimeBlock value={seconds} label="Sec" />
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-muted hover:border-primary hover:text-primary">
              
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-ink-muted hover:border-primary hover:text-primary">
              
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {products.map((product) =>
        <div
          key={product.id}
          className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]">
          
            <ProductCard product={product} />
          </div>
        )}
      </div>
    </section>);

}