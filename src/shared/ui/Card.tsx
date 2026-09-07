import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type CardVariant = 'default' | 'hover' | 'gradient';

const BASE = 'transition';

const VARIANTS: Record<CardVariant, string> = {
  default: 'rounded-2xl border border-gray-100 bg-white p-6 shadow-soft',
  hover:
    'rounded-2xl border border-gray-100 bg-white p-6 shadow-soft hover:-translate-y-1 hover:shadow-lifted',
  gradient:
    'rounded-3xl bg-linear-135 from-brand-500 to-accent-400 p-8 text-white shadow-float',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div className={cn(BASE, VARIANTS[variant], className)} {...rest}>
      {children}
    </div>
  );
}
