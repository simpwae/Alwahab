import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, CheckIcon, ArrowUpDownIcon } from 'lucide-react';
import { SortOption, SORT_LABELS } from './types';
const OPTIONS: SortOption[] = [
'featured',
'newest',
'price-asc',
'price-desc',
'discount',
'best-selling',
'top-rated'];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-primary">
        
        <ArrowUpDownIcon className="h-3.5 w-3.5 text-ink-muted" />
        <span className="hidden sm:inline">Sort:</span>
        {SORT_LABELS[value]}
        <ChevronDownIcon className="h-3.5 w-3.5 text-ink-muted" />
      </button>
      <AnimatePresence>
        {open &&
        <motion.ul
          role="listbox"
          initial={{
            opacity: 0,
            y: -6
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -6
          }}
          transition={{
            duration: 0.15
          }}
          className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-card">
          
            {OPTIONS.map((option) =>
          <li key={option}>
                <button
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-ink transition-colors hover:bg-surface">
              
                  {SORT_LABELS[option]}
                  {value === option &&
              <CheckIcon className="h-3.5 w-3.5 text-primary" />
              }
                </button>
              </li>
          )}
          </motion.ul>
        }
      </AnimatePresence>
    </div>);

}