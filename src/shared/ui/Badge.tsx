import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type BadgeTone =
  'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

const BASE =
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold';

const TONES: Record<BadgeTone, string> = {
  brand: 'bg-brand-500 text-white',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  error: 'bg-error-100 text-error-600',
  info: 'bg-info-100 text-info-600',
  neutral: 'bg-gray-100 text-gray-600',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({
  tone = 'brand',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(BASE, TONES[tone], className)} {...rest}>
      {children}
    </span>
  );
}
