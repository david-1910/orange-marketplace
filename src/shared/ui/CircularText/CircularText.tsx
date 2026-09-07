import { useId } from 'react';

import { useReducedMotion } from 'motion/react';

import { cn } from '@/shared/lib';

export interface CircularTextProps {
  text: string;
  /** Секунды на полный оборот. */
  speed?: number;
  className?: string;
}

/**
 * Текст по окружности, медленно вращающийся.
 *
 * Вращение на CSS-анимации: это бесконечная линейная крутилка,
 * ей не нужен ни один кадр на JS. Длительность задаётся инлайном,
 * поэтому animate-spin переиспользуется с любой скоростью.
 */
export function CircularText({
  text,
  speed = 12,
  className,
}: CircularTextProps) {
  const pathId = useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={cn('size-full', className)}
    >
      <defs>
        <path
          id={pathId}
          fill="none"
          d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
        />
      </defs>

      <g
        className={shouldReduceMotion ? undefined : 'animate-spin'}
        style={{
          animationDuration: `${speed}s`,
          transformOrigin: '50% 50%',
        }}
      >
        <text
          className="fill-current text-[9px] font-semibold uppercase"
          style={{ letterSpacing: '0.14em' }}
        >
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </g>
    </svg>
  );
}
