import { useCallback, useState, type MouseEvent, type ReactNode } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { MOTION_DURATION } from '@/shared/config';
import { cn } from '@/shared/lib';

export interface ClickSparkProps {
  children: ReactNode;
  /** Сколько искр разлетается за клик. */
  count?: number;
  /** Дальность разлёта в пикселях. */
  distance?: number;
  className?: string;
}

interface Burst {
  id: number;
  x: number;
  y: number;
}

const SPARK_DURATION = MOTION_DURATION.section;

/**
 * Оранжевые искры из точки клика.
 *
 * Обёртка не перехватывает события: клик доходит до ребёнка как обычно,
 * поэтому её можно надеть на любую кнопку или ссылку.
 */
export function ClickSpark({
  children,
  count = 8,
  distance = 48,
  className,
}: ClickSparkProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      if (shouldReduceMotion) return;

      const { left, top } = event.currentTarget.getBoundingClientRect();
      const burst: Burst = {
        id: Date.now() + Math.random(),
        x: event.clientX - left,
        y: event.clientY - top,
      };

      setBursts((current) => [...current, burst]);
      window.setTimeout(
        () => setBursts((current) => current.filter((i) => i.id !== burst.id)),
        SPARK_DURATION * 1000,
      );
    },
    [shouldReduceMotion],
  );

  return (
    <span
      onClick={handleClick}
      className={cn('relative inline-block', className)}
    >
      {children}

      <span aria-hidden className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {bursts.map((burst) =>
            Array.from({ length: count }, (_, index) => {
              const angle = (index / count) * Math.PI * 2;

              return (
                <motion.span
                  key={`${burst.id}-${index}`}
                  className="bg-brand-500 absolute size-1 rounded-full"
                  style={{ left: burst.x, top: burst.y }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0.4,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: SPARK_DURATION, ease: 'easeOut' }}
                />
              );
            }),
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}
