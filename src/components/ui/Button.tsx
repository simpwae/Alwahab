import React from 'react';
type ButtonVariant =
'primary' |
'secondary' |
'ghost' |
'accent' |
'danger-ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
  'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/40',
  secondary:
  'bg-white text-ink border border-gray-300 hover:border-primary hover:text-primary disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-gray-100 disabled:opacity-50',
  accent: 'bg-accent text-white hover:bg-accent-dark disabled:bg-accent/40',
  'danger-ghost':
  'bg-transparent text-red-600 hover:bg-red-50 disabled:opacity-50'
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2'
};
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}>
      
      {icon}
      {children}
    </button>);

}