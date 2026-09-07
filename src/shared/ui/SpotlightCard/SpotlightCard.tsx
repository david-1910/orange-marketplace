import { useRef, type PropsWithChildren } from 'react';

import { motion, useMotionTemplate, useTransform } from 'motion/react';

import {
  useElementRect,
  useMousePosition,
  usePointerFine,
} from '@/shared/hooks';
import { cn } from '@/shared/lib';

export interface SpotlightCardProps extends PropsWithChildren {
  /** Диаметр пятна света в пикселях. */
  radius?: number;
  className?: string;
}

/**
 * Карточка с оранжевым пятном света, следующим за курсором.
 *
 * Пятно — обычный radial-gradient, координаты которого приходят
 * из общего useMousePosition, поэтому своих слушателей нет и таких
 * карточек в сетке может быть сколько угодно.
 */
export function SpotlightCard({
  radius = 340,
  className,
  children,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useElementRect(ref);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const isPointerFine = usePointerFine();

  const localX = useTransform(
    mouseX,
    (value) => value - (rect.current.centerX - rect.current.width / 2),
  );
  const localY = useTransform(
    mouseY,
    (value) => value - (rect.current.centerY - rect.current.height / 2),
  );

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${localX}px ${localY}px, var(--color-brand-200), transparent 65%)`;

  return (
    <div
      ref={ref}
      className={cn(
        'group hover:border-brand-300 relative overflow-hidden rounded-3xl border border-gray-900/5 bg-white transition-colors',
        className,
      )}
    >
      {isPointerFine && (
        <motion.div
          aria-hidden
          style={{ background }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
        />
      )}

      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}
