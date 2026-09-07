import { cn } from '@/shared/lib';

export interface NoiseProps {
  /** Плотность зерна, 0…1. */
  opacity?: number;
  className?: string;
}

/**
 * Зерно поверх плоскости — «бумажный» editorial-фон.
 *
 * Это background-image из data-URI, а не SVG-фильтр над контентом:
 * браузер растрирует картинку один раз и дальше просто тайлит её.
 * Живой feTurbulence поверх страницы пересчитывался бы при каждом
 * скролле и ронял кадры.
 */
const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Noise({ opacity = 0.05, className }: NoiseProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ backgroundImage: NOISE_TILE, opacity }}
    />
  );
}
