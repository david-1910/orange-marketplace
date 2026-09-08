import type { ProductFilters } from '../model/types';

/**
 * Фабрика ключей кеша. Иерархия важна: инвалидация по productKeys.all
 * сбрасывает и списки, и карточки товаров одним вызовом.
 *
 * Лежит в config, а не в api: это набор констант, а не запрос.
 * Наружу из слайса не экспортируется — инвалидация кеша сущности
 * остаётся её собственным делом.
 */
export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  /**
   * Лента отделена от списков собственным сегментом ключа: у
   * useInfiniteQuery другая форма данных (страницы вместо массива),
   * и попади она в один ключ со списком — кеш отдал бы одному
   * хуку данные, рассчитанные на другой.
   */
  infinite: (filters: ProductFilters) =>
    [...productKeys.all, 'infinite', filters] as const,
  priceRange: () => [...productKeys.all, 'price-range'] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
