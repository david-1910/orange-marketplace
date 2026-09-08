import { useQuery } from '@tanstack/react-query';

import { getProductsRequest } from '../api/product-api';
import { productKeys } from '../config/queryKeys';
import type { ProductFilters } from './types';

export interface UseProductsOptions {
  /**
   * Отключить запрос.
   *
   * Нужно тем, кто запрашивает по условию — например подсказкам
   * поиска, пока запрос слишком короткий. Без этого им пришлось бы
   * передавать пустые фильтры, а пустые фильтры означают «весь
   * каталог», и вместо тишины уходил бы самый тяжёлый запрос.
   */
  isEnabled?: boolean;
}

/**
 * Список товаров, при необходимости отфильтрованный.
 *
 * Пустой массив ids — это «показывать нечего», а не «показать всё»,
 * поэтому запрос в таком случае не уходит: иначе пустое избранное
 * отрисовало бы весь каталог.
 */
export const useProducts = (
  filters: ProductFilters = {},
  { isEnabled = true }: UseProductsOptions = {},
) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProductsRequest(filters),
    enabled: isEnabled && (filters.ids ? filters.ids.length > 0 : true),
  });
