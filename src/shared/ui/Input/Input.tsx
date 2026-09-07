import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { INPUT_BASE, INPUT_INVALID, INPUT_WITH_ICON } from './inputVariants';

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
          className={cn(
            INPUT_BASE,
            icon && INPUT_WITH_ICON,
            error && INPUT_INVALID,
            className,
          )}
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
