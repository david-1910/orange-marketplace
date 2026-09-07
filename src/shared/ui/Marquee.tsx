import type { ReactNode } from 'react';

import { useReducedMotion } from 'motion/react';

import { cn } from '@/shared/lib';

export interface MarqueeProps {
  children: ReactNode;
  /** Секунды на один полный проход. */
  speed?: number;
  vertical?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Бесконечная бегущая строка на CSS-анимации.
 *
 * Содержимое дублируется и уезжает на -50%: в момент стыка полоса
 * визуально идентична началу, поэтому шва не видно. Анимация
 * не на motion специально — здесь не нужен ни один кадр на JS.
 */
export function Marquee({
  children,
  speed = 30,
  vertical = false,
  pauseOnHover = false,
  className,
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <div className={cn('flex', vertical && 'flex-col')}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('group overflow-hidden', className)}>
      <div
        className={cn(
          'flex',
          vertical
            ? 'animate-marquee-y h-max flex-col'
            : 'animate-marquee-x w-max flex-row',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className={cn('flex shrink-0', vertical && 'flex-col')}>
          {children}
        </div>
        <div
          className={cn('flex shrink-0', vertical && 'flex-col')}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}
