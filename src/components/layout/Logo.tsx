import React from 'react';
import { Link } from 'react-router-dom';
export function Logo({ className = '' }: {className?: string;}) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-0.5 font-display text-2xl font-extrabold text-ink ${className}`}>
      
      Alwahab
      <span
        className="mb-3 h-2 w-2 rounded-full bg-accent"
        aria-hidden="true" />
      
    </Link>);

}