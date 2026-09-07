import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { BADGE_BASE, BADGE_TONES, type BadgeTone } from './badgeVariants';

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
    <span className={cn(BADGE_BASE, BADGE_TONES[tone], className)} {...rest}>
      {children}
    </span>
  );
}
