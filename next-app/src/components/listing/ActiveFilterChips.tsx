"use client";

import React from 'react';
import { XIcon } from 'lucide-react';
import { ListingFilters, DEFAULT_MAX_PRICE } from './types';
interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}
interface ActiveFilterChipsProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}
export function ActiveFilterChips({
  filters,
  onChange
}: ActiveFilterChipsProps) {
  const chips: Chip[] = [
  ...filters.categories.map((c) => ({
    key: `cat-${c}`,
    label: c,
    onRemove: () =>
    onChange({
      ...filters,
      categories: filters.categories.filter((v) => v !== c)
    })
  })),
  ...filters.brands.map((b) => ({
    key: `brand-${b}`,
    label: b,
    onRemove: () =>
    onChange({
      ...filters,
      brands: filters.brands.filter((v) => v !== b)
    })
  })),
  ...(filters.minRating !== null ?
  [
  {
    key: 'rating',
    label: `${filters.minRating}★ & up`,
    onRemove: () =>
    onChange({
      ...filters,
      minRating: null
    })
  }] :

  []),
  ...(filters.minDiscount !== null ?
  [
  {
    key: 'discount',
    label: `${filters.minDiscount}% off or more`,
    onRemove: () =>
    onChange({
      ...filters,
      minDiscount: null
    })
  }] :

  []),
  ...(filters.inStockOnly ?
  [
  {
    key: 'stock',
    label: 'In Stock Only',
    onRemove: () =>
    onChange({
      ...filters,
      inStockOnly: false
    })
  }] :

  []),
  ...(filters.maxPrice < DEFAULT_MAX_PRICE ?
  [
  {
    key: 'price',
    label: `Under PKR ${filters.maxPrice.toLocaleString()}`,
    onRemove: () =>
    onChange({
      ...filters,
      maxPrice: DEFAULT_MAX_PRICE
    })
  }] :

  [])];

  if (chips.length === 0) return null;
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="list"
      aria-label="Active filters">

      {chips.map((chip) =>
      <span
        key={chip.key}
        role="listitem"
        className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary">

          {chip.label}
          <button
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove ${chip.label} filter`}
          className="rounded-full p-0.5 hover:bg-primary/15">

            <XIcon className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>);

}
