import { useState } from 'react';

import { formatPrice, usePriceRange } from '@/entities/product';
import { RangeSlider, Skeleton } from '@/shared/ui';

export interface PriceSectionProps {
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (range: [number, number] | null) => void;
}

/**
 * Шаг слайдера. Разбег цен — десятки миллионов сум, и шаг в один сум
 * означал бы, что ручку нельзя поставить осмысленно.
 */
const STEP = 100_000;

/**
 * Границы округляются по шагу: нижняя вниз, верхняя вверх.
 *
 * Это исправление настоящей ошибки, а не косметика. Нативный range
 * ходит значениями `min + n * step`, поэтому при min 95 000 и шаге
 * 100 000 достижимые значения — 95 000, 195 000, 295 000… и до
 * 34 990 000 правая ручка не доезжает никогда. В результате фильтр
 * цены оставался включённым даже в крайнем положении и всегда
 * отсекал самые дорогие товары: каталог не показывал диапазон
 * целиком.
 */
const floorToStep = (value: number): number => Math.floor(value / STEP) * STEP;

const ceilToStep = (value: number): number => Math.ceil(value / STEP) * STEP;

/**
 * Диапазон цены слайдером с двумя ручками.
 *
 * Пока ручку тянут, значение живёт в локальном состоянии, а в
 * query-параметры уходит только по отпусканию. Иначе каждый пиксель
 * перетаскивания менял бы URL и перезапускал запрос — десятки записей
 * в историю браузера и мерцающая лента.
 *
 * Концы дорожки берутся из каталога целиком, а не из текущей выборки,
 * поэтому при смене категории слайдер не прыгает.
 */
export function PriceSection({
  minPrice,
  maxPrice,
  onChange,
}: PriceSectionProps) {
  const { data: range, isPending } = usePriceRange();

  const low = range ? floorToStep(range.min) : 0;
  const high = range ? ceilToStep(range.max) : 0;

  const applied: [number, number] = [minPrice ?? low, maxPrice ?? high];

  // Внешнее значение меняется не только этим компонентом: сброс
  // фильтров и переход «назад» тоже правят query-параметры, и
  // черновик должен догонять их, иначе ручки останутся где были.
  //
  // Синхронизация — корректировкой состояния во время рендера, а не в
  // useEffect: эффект дал бы лишний проход и кадр с устаревшими
  // ручками, и правило react-hooks/set-state-in-effect справедливо на
  // него ругается.
  const signature = `${applied[0]}:${applied[1]}`;
  const [state, setState] = useState({ signature, draft: applied });

  if (state.signature !== signature) {
    setState({ signature, draft: applied });
  }

  const { draft } = state;

  if (isPending || !range) {
    return <Skeleton className="h-14" />;
  }

  const commit = () => {
    // Диапазон во всю ширину — это отсутствие фильтра, а не фильтр
    // «от самого дешёвого до самого дорогого»: держать такие
    // параметры в URL незачем, да и лишний фильтр в счётчике
    // выглядел бы как выбранный вручную.
    onChange(draft[0] <= low && draft[1] >= high ? null : [...draft]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-ui flex items-center justify-between gap-2 text-gray-900 tabular-nums">
        <span>{formatPrice(draft[0])}</span>
        <span aria-hidden className="text-gray-300">
          —
        </span>
        <span>{formatPrice(draft[1])}</span>
      </div>

      {/* Отпускание ловим и на самом контейнере, и глобально: если
          курсор ушёл за пределы панели и кнопку отпустили там,
          pointerup до контейнера не дойдёт, и выбранный диапазон
          никогда бы не применился. */}
      <div
        onPointerUp={commit}
        onPointerLeave={(event) => {
          if (event.buttons === 0) return;
          commit();
        }}
        onKeyUp={commit}
      >
        <RangeSlider
          min={low}
          max={high}
          step={STEP}
          value={draft}
          onChange={(next) =>
            setState((current) => ({ ...current, draft: next }))
          }
          minLabel="Цена от"
          maxLabel="Цена до"
        />
      </div>
    </div>
  );
}
