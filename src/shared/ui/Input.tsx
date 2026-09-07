import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

const BASE =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50 disabled:text-gray-400';

const WITH_ICON = 'pl-10';

const INVALID = 'border-error-500 focus:border-error-500 focus:ring-error-100';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(BASE, icon && WITH_ICON, error && INVALID, className)}
          {...rest}
        />
      </div>

      {error && (
        <p id={errorId} className="text-error-600 mt-1 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
