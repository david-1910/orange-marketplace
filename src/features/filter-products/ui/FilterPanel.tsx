import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/ui';

import type { ProductFiltersState } from '../model/useProductFilters';

import { CategorySection } from './CategorySection';
import { PriceSection } from './PriceSection';
import { RatingSection } from './RatingSection';

export interface FilterPanelProps {
  filters: ProductFiltersState;
  /** Приписка внизу панели — например «Найдено N товаров». */
  footer?: ReactNode;
  className?: string;
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-2.5 border-t border-gray-900/5 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-label text-gray-400 uppercase">{title}</h3>
      {children}
    </section>
  );
}

/**
 * Боковая панель фильтров каталога.
 *
 * Все три фильтра развёрнуты сразу, без выпадающих меню: панель стоит
 * в отдельной колонке, места хватает, а спрятанный фильтр покупатель
 * просто не найдёт.
 *
 * Состояние панель не хранит: оно приходит из useProductFilters,
 * который держит его в query-параметрах. Поэтому ссылку на
 * отфильтрованный каталог можно отправить, а «назад» возвращает
 * прежний набор.
 *
 * Липкость задаёт страница, а не панель: насколько ей отступать от
 * шапки — свойство раскладки конкретного экрана, а не самой панели.
 */
export function FilterPanel({ filters, footer, className }: FilterPanelProps) {
  const {
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    activeCount,
    setCategoryId,
    setPriceRange,
    setMinRating,
    reset,
  } = filters;

  return (
    <aside
      aria-label="Фильтры"
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-total flex items-center gap-2 text-gray-900">
          Фильтры
          {activeCount > 0 && (
            <Badge className="tabular-nums">{activeCount}</Badge>
          )}
        </h2>

        {/* Сброс появляется только когда есть что сбрасывать: иначе
            это мёртвая кнопка, которая занимает место и сбивает. */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-ui hover:text-brand-600 text-gray-400 transition-colors"
          >
            Сбросить
          </button>
        )}
      </div>

      <Section title="Категория">
        <CategorySection value={categoryId} onChange={setCategoryId} />
      </Section>

      <Section title="Цена">
        <PriceSection
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChange={setPriceRange}
        />
      </Section>

      <Section title="Рейтинг">
        <RatingSection value={minRating} onChange={setMinRating} />
      </Section>

      {footer && (
        <div className="border-t border-gray-900/5 pt-4">{footer}</div>
      )}
    </aside>
  );
}
