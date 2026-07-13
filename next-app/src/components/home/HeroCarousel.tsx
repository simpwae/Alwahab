"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  bg: string;
}
const SLIDES: Slide[] = [
{
  id: 's1',
  eyebrow: 'Flash Sale',
  title: 'Up to 40% off Electronics',
  subtitle: 'Headphones, speakers & smartwatches — this week only.',
  ctaLabel: 'Shop Electronics',
  ctaHref: '/category/electronics',
  image:
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
  bg: '#0E7C6B'
},
{
  id: 's2',
  eyebrow: 'New Season',
  title: 'Upgrade Your Kitchen',
  subtitle: 'Premium cookware sets and smart appliances for every home.',
  ctaLabel: 'Shop Home & Kitchen',
  ctaHref: '/category/home-kitchen',
  image:
  'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=1000&q=80',
  bg: '#0B6255'
},
{
  id: 's3',
  eyebrow: 'Just Dropped',
  title: 'Gadgets for Everyday Life',
  subtitle: 'Discover fitness trackers, hubs, and smart accessories.',
  ctaLabel: 'Shop Gadgets',
  ctaHref: '/category/gadgets',
  image:
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
  bg: '#1A1A1A'
}];

export function HeroCarousel() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + SLIDES.length) % SLIDES.length);
    },
    [index]
  );
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  const slide = SLIDES[index];
  return (
    <section
      aria-label="Promotions"
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl">

      <div className="relative h-[280px] sm:h-[340px] lg:h-[420px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction * 40
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: direction * -40
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 flex items-center"
            style={{
              backgroundColor: slide.bg
            }}>

            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 text-white sm:px-10 lg:px-16">
              <span className="mb-3 inline-flex w-max items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {slide.eyebrow}
              </span>
              <h2 className="max-w-lg font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                {slide.title}
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
                {slide.subtitle}
              </p>
              <div className="mt-5">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => router.push(slide.ctaHref)}>

                  {slide.ctaLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white">

        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white">

        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <div
        className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Slide selector">

        {SLIDES.map((s, i) =>
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => goTo(i)}
          className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`} />

        )}
      </div>
    </section>);

}
