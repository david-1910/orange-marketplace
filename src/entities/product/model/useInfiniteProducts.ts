import { useInfiniteQuery } from '@tanstack/react-query';

import { getProductsPageRequest } from '../api/product-api';
import { productKeys } from '../config/queryKeys';
import type { ProductFilters } from './types';

/**
 * Каталог страницами — для бесконечной ленты.
 *
 * `getNextPageParam` читает `nextPage` из ответа, а не вычисляет конец
 * по длине последней страницы: последняя страница почти всегда
 * неполная, и по длине лента останавливалась бы на страницу раньше
 * или дёргала бы пустой запрос.
 *
 * Смена фильтров меняет ключ, поэтому лента начинается заново — это и
 * есть нужное поведение: выбрал категорию, увидел её первую страницу.
 */
export const useInfiniteProducts = (filters: ProductFilters = {}) =>
  useInfiniteQuery({
    queryKey: productKeys.infinite(filters),
    queryFn: ({ pageParam }) => getProductsPageRequest(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
