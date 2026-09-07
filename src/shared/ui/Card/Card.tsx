import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { CARD_BASE, CARD_VARIANTS, type CardVariant } from './cardVariants';

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
    <div className={cn(CARD_BASE, CARD_VARIANTS[variant], className)} {...rest}>
      {children}
    </div>
  );
}
