import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
}
export function FormField({
  label,
  id,
  error,
  hint,
  leadingIcon,
  className = '',
  ...rest
}: FormFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {leadingIcon &&
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leadingIcon}
          </span>
        }
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-offset-0 ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-primary/20'} ${leadingIcon ? 'pl-10' : ''} ${className}`}
          {...rest} />
        
      </div>
      {error ?
      <p
        id={`${id}-error`}
        className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
        
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p> :
      hint ?
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p> :
      null}
    </div>);

}