import { useId } from 'react';

import { cn } from '@/shared/lib';

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** Подписи ручек для скринридера. */
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

/**
 * Слайдер диапазона с двумя ручками.
 *
 * Собран из двух нативных `<input type="range">`, наложенных друг на
 * друга, а не из div'ов с обработчиками указателя. Это принципиально:
 * нативный range бесплатно даёт управление стрелками и Home/End,
 * роль `slider` с озвучиванием значения, работу с тачем и фокус. У
 * самодельной ручки всё это пришлось бы писать и годами чинить.
 *
 * Ручки не могут перескочить друг через друга: значение зажимается в
 * обработчике, поэтому «от» никогда не станет больше «до».
 *
 * Дорожка и заполненная часть — отдельные слои под инпутами; сами
 * инпуты прозрачны и ловят события, поэтому кликабельна вся ширина.
 */
export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel = 'Минимум',
  maxLabel = 'Максимум',
  className,
}: RangeSliderProps) {
  const id = useId();
  const [from, to] = value;

  const span = max - min || 1;
  const fromPercent = ((from - min) / span) * 100;
  const toPercent = ((to - min) / span) * 100;

  const THUMB =
    'pointer-events-none absolute inset-x-0 top-1/2 h-0 -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-soft [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand-500';

  return (
    <div className={cn('relative h-5', className)}>
      {/* Дорожка */}
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-900/10" />

      {/* Выбранный отрезок */}
      <div
        className="bg-brand-500 absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
        style={{
          left: `${fromPercent}%`,
          width: `${Math.max(toPercent - fromPercent, 0)}%`,
        }}
      />

      <input
        id={`${id}-from`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={from}
        aria-label={minLabel}
        // Зажимаем: ручка «от» останавливается на «до», а не проходит
        // сквозь неё, иначе диапазон вывернулся бы наизнанку.
        onChange={(event) =>
          onChange([Math.min(Number(event.target.value), to), to])
        }
        className={THUMB}
      />

      <input
        id={`${id}-to`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={to}
        aria-label={maxLabel}
        onChange={(event) =>
          onChange([from, Math.max(Number(event.target.value), from)])
        }
        className={THUMB}
      />
    </div>
  );
}
