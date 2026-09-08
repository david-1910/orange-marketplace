import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'react-router';

import { CATALOG_CATEGORY_PARAM } from '@/entities/category';
import type { ProductFilters, ProductSort } from '@/entities/product';

/** Имена query-параметров цены и рейтинга. */
const PRICE_MIN_PARAM = 'price_min';
const PRICE_MAX_PARAM = 'price_max';
const RATING_PARAM = 'rating';

/**
 * Порядок выдачи — всегда от дешёвых к дорогим.
 *
 * Константа, а не настройка: каталог без сортировки выдавал товары в
 * порядке фикстур, и цены в сетке шли вразнобой. Переключатель в
 * панели фильтров стоял вертикальным списком и повторял собой список
 * категорий, поэтому убран — порядок для магазина предсказуем и без
 * него.
 *
 * Когда сортировка снова понадобится как выбор, ей место рядом с
 * товарами, а не в фильтрах: это не фильтр, а способ показа.
 */
const SORT: ProductSort = 'price-asc';

export interface ProductFiltersState {
  categoryId: string | null;
  /** null — граница не задана, слайдер стоит на конце дорожки. */
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  /** Готовые фильтры для запроса — их принимает лента. */
  filters: ProductFilters;
  /** Сколько фильтров задано — для счётчика и кнопки сброса. */
  activeCount: number;
  setCategoryId: (categoryId: string | null) => void;
  setPriceRange: (range: [number, number] | null) => void;
  setMinRating: (rating: number | null) => void;
  reset: () => void;
}

/** Число из query-параметра; null, если параметра нет или он мусорный. */
const readNumber = (raw: string | null): number | null => {
  if (raw === null) return null;

  const value = Number(raw);

  return Number.isFinite(value) ? value : null;
};

/**
 * Все фильтры каталога: категория, цена, рейтинг.
 *
 * Живут в query-параметрах, а не в состоянии компонента: ссылку на
 * отфильтрованный каталог можно отправить, и она откроется в том же
 * виде, а кнопка «назад» возвращает предыдущий набор фильтров.
 *
 * Слайс переименован из filter-by-category: он больше не только про
 * категории, и прежнее имя обещало меньше, чем слайс делает.
 *
 * `filters` собираются здесь же, а не в ленте: правило «пустой
 * параметр — значит фильтра нет» должно быть описано один раз, иначе
 * лента и панель начнут расходиться в понимании того, что задано.
 */
export const useProductFilters = (): ProductFiltersState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get(CATALOG_CATEGORY_PARAM);
  const minPrice = readNumber(searchParams.get(PRICE_MIN_PARAM));
  const maxPrice = readNumber(searchParams.get(PRICE_MAX_PARAM));
  const minRating = readNumber(searchParams.get(RATING_PARAM));

  const update = useCallback(
    (change: (params: URLSearchParams) => void) => {
      setSearchParams(
        (params) => {
          change(params);
          return params;
        },
        // Смена фильтра не должна отматывать каталог к началу.
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const filters = useMemo<ProductFilters>(
    () => ({
      ...(categoryId ? { categoryId } : {}),
      ...(minPrice !== null ? { minPrice } : {}),
      ...(maxPrice !== null ? { maxPrice } : {}),
      ...(minRating !== null ? { minRating } : {}),
      sort: SORT,
    }),
    [categoryId, minPrice, maxPrice, minRating],
  );

  return {
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    filters,
    // Сортировка в счётчик не идёт: это не фильтр, она задана всегда,
    // и «1 фильтр» на пустом каталоге сбивало бы с толку.
    activeCount: Object.keys(filters).length - 1,

    setCategoryId: useCallback(
      (next) =>
        update((params) => {
          if (next) params.set(CATALOG_CATEGORY_PARAM, next);
          else params.delete(CATALOG_CATEGORY_PARAM);
        }),
      [update],
    ),

    setPriceRange: useCallback(
      (range) =>
        update((params) => {
          if (!range) {
            params.delete(PRICE_MIN_PARAM);
            params.delete(PRICE_MAX_PARAM);
            return;
          }

          params.set(PRICE_MIN_PARAM, String(range[0]));
          params.set(PRICE_MAX_PARAM, String(range[1]));
        }),
      [update],
    ),

    setMinRating: useCallback(
      (rating) =>
        update((params) => {
          if (rating === null) params.delete(RATING_PARAM);
          else params.set(RATING_PARAM, String(rating));
        }),
      [update],
    ),

    reset: useCallback(
      () =>
        update((params) => {
          params.delete(CATALOG_CATEGORY_PARAM);
          params.delete(PRICE_MIN_PARAM);
          params.delete(PRICE_MAX_PARAM);
          params.delete(RATING_PARAM);
        }),
      [update],
    ),
  };
};
