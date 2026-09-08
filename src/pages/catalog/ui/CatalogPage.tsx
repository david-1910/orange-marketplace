import { useCallback, useMemo, useState } from 'react';

import { Outlet } from 'react-router';

import type { ProductFilters } from '@/entities/product';
import { FilterPanel, useProductFilters } from '@/features/filter-products';
import { useProductSearch } from '@/features/search-products';
import { IconClose, SplitText } from '@/shared/ui';
import { ProductFeed } from '@/widgets/product-grid';
import { PromoStrip } from '@/widgets/promo-strip';

/**
 * Раскладка сетки в правой колонке.
 *
 * Колонок меньше, чем во всю ширину: рядом стоит панель фильтров, и
 * прежние пять на этой ширине давали сплющенные карточки. Здесь же
 * товары и мельче — так их видно больше за один экран.
 */
const CATALOG_GRID_CLASSES =
  'grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))]';

/**
 * Каталог: панель фильтров слева, лента товаров справа.
 *
 * Панель липкая и едет вместе с прокруткой — `top-24` держит её под
 * шапкой (та `fixed` высотой 92px на широких экранах), а не за ней.
 *
 * Фильтрами и поиском владеют разные фичи, и страница их соединяет:
 * фильтры задаются только здесь, а запрос приходит из шапки, то есть
 * с любой страницы. Обе части хранят себя в query-параметрах, поэтому
 * ссылка на «кроссовки дешевле пяти миллионов» открывается в том же
 * виде.
 *
 * Outlet держит место под overlay товара: каталог остаётся
 * смонтированным, поэтому изображение может перелететь из модуля
 * ленты в галерею через layoutId.
 */
export function CatalogPage() {
  const filters = useProductFilters();
  const search = useProductSearch();
  const [total, setTotal] = useState(0);

  // Колбэк стабилен: иначе он менялся бы на каждый рендер страницы и
  // перезапускал эффект внутри ленты.
  const handleTotalChange = useCallback((value: number) => {
    setTotal(value);
  }, []);

  const feedFilters = useMemo<ProductFilters>(
    () => ({
      ...filters.filters,
      ...(search.query ? { query: search.query } : {}),
    }),
    [filters.filters, search.query],
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[110rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
        <div className="mb-8 flex flex-col gap-3">
          <span className="text-label text-gray-400 uppercase">
            02 — Каталог
          </span>
          <p aria-hidden className="text-display-sm text-gray-900 uppercase">
            <SplitText
              // Заголовок меняется вместе с запросом: увидеть слово,
              // которое искал, важнее, чем красивое «Всё сразу».
              text={search.query ? 'Поиск' : 'Всё сразу'}
              by="word"
              stagger={0.06}
            />
          </p>
          <h1 className="sr-only">
            {search.query
              ? `Результаты поиска: ${search.query}`
              : 'Каталог товаров'}
          </h1>

          {search.query && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-ui text-gray-500">
                По запросу «{search.query}» — {total}
              </p>

              <button
                type="button"
                onClick={search.clear}
                className="text-label hover:border-brand-500 hover:text-brand-600 flex items-center gap-1.5 rounded-full border border-gray-900/10 px-3 py-1.5 text-gray-500 uppercase transition-colors"
              >
                <IconClose className="size-3.5" />
                Сбросить поиск
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            {/* 7rem = 96px отступа сверху под шапкой плюс 16px снизу,
                чтобы панель не упиралась в кромку экрана. Своя
                прокрутка остаётся страховкой для низких окон: без неё
                нижние фильтры стали бы недостижимы. */}
            <div
              data-lenis-prevent
              className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto"
            >
              <FilterPanel
                filters={filters}
                footer={
                  <p className="text-ui text-gray-500 tabular-nums">
                    Найдено {total}
                  </p>
                }
              />
            </div>
          </div>

          <div className="lg:col-span-9">
            <ProductFeed
              filters={feedFilters}
              gridClassName={CATALOG_GRID_CLASSES}
              onTotalChange={handleTotalChange}
              // Баннер после второй строки сетки, а не первой: сразу
              // под фильтрами он читался бы как часть шапки каталога,
              // а не как находка среди товаров. На узких экранах строка
              // из двух карточек, поэтому восемь — это компромисс между
              // раскладками.
              insertion={{ after: 8, content: <PromoStrip /> }}
            />
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
}
