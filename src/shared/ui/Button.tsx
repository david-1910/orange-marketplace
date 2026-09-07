import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type ButtonVariant =
  'primary' | 'outline' | 'ghost' | 'success' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

/**
 * Наборы классов держим рядом с компонентом, а не отдельным файлом:
 * они не переиспользуются никем другим, а отдельный buttonVariants.ts
 * был бы набором констант внутри сегмента ui — регламент это
 * запрещает.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-95 disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white shadow-glow hover:bg-brand-600',
  outline:
    'border border-gray-200 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-600',
  ghost: 'font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600',
  success: 'bg-success-500 text-white shadow-sm hover:bg-success-600',
  danger: 'bg-error-500 text-white shadow-sm hover:bg-error-600',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  icon: 'size-10 text-sm',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
