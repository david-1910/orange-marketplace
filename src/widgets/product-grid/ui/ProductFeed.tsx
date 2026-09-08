import { useEffect, useMemo, useRef } from 'react';

import { useInView } from 'motion/react';

import {
  PRODUCTS_PAGE_SIZE,
  type ProductFilters,
  useInfiniteProducts,
} from '@/entities/product';

import { ProductGridView } from './ProductGridView';

export interface ProductFeedProps {
  /** Готовые фильтры — их собирает фича фильтрации. */
  filters: ProductFilters;
  /** Классы раскладки сетки: в колонке рядом с панелью она уже. */
  gridClassName?: string;
  /** Сообщить наружу, сколько всего товаров нашлось. */
  onTotalChange?: (total: number) => void;
}

/**
 * Каталог бесконечной лентой.
 *
 * Подгрузка идёт по двум путям сразу, и это не дублирование:
 *
 * 1. Сентинел под сеткой — доскроллил, страница подъехала сама.
 *    Наблюдение через useInView из motion (реэкспорт framer-motion) —
 *    свой IntersectionObserver в проекте не нужен.
 * 2. Кнопка «Показать ещё» — без неё до футера нельзя добраться ни
 *    мышью, ни с клавиатуры: сентинел утягивал бы следующую страницу
 *    ровно в тот момент, когда до низа наконец дошли.
 *
 * `margin` у наблюдателя положительный: страница начинает грузиться,
 * когда до сентинела остаётся экран с небольшим запасом, поэтому к
 * моменту его появления карточки уже на месте.
 */
export function ProductFeed({
  filters,
  gridClassName,
  onTotalChange,
}: ProductFeedProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(filters);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isSentinelInView = useInView(sentinelRef, { margin: '400px' });

  useEffect(() => {
    if (isSentinelInView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isSentinelInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items),
    [data],
  );

  const total = data?.pages[0]?.total ?? 0;
  const shown = products?.length ?? 0;

  // Счётчик нужен и панели фильтров, а панель — сестра ленты в
  // раскладке страницы, не её родитель. Поэтому число уходит наверх
  // колбэком, а страница раздаёт его тому, кто рисует.
  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  return (
    <>
      <ProductGridView
        products={products}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        skeletonCount={PRODUCTS_PAGE_SIZE}
        {...(gridClassName ? { gridClassName } : {})}
      >
        {shown > 0 && (
          <div className="mt-10 flex flex-col items-center gap-5">
            {/* Счётчик озвучивается: без него подгрузка для скринридера
              выглядит как ничего не происходящее ожидание. */}
            <p
              aria-live="polite"
              className="text-label text-gray-400 uppercase"
            >
              Показано {shown} из {total}
            </p>

            {hasNextPage ? (
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                aria-disabled={isFetchingNextPage}
                className="text-label hover:border-brand-500 hover:text-brand-600 rounded-full border border-gray-900/10 px-6 py-4 text-gray-900 uppercase transition-colors aria-disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Загружаем…' : 'Показать ещё'}
              </button>
            ) : (
              <p className="text-label text-gray-300 uppercase">
                Это все товары
              </p>
            )}
          </div>
        )}
      </ProductGridView>

      {/*
        Сентинел живёт вне сетки, а не внутри её children, и это
        исправление настоящей ошибки: внутри он рендерился только
        после загрузки первой страницы, а useInView создаёт
        IntersectionObserver один раз при монтировании — на пустой
        ref он ни к чему не привязывался и потом не пересоздавался,
        поэтому лента молчала и подгружалась только кнопкой.
      */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
    </>
  );
}
