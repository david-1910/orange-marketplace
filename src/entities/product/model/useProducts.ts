import { keepPreviousData, useQuery } from '@tanstack/react-query';

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
    /**
     * При смене фильтров показываем прежний ответ, пока едет новый.
     *
     * Это не оптимизация, а исправление: список ids входит в ключ
     * запроса, поэтому удаление товара из корзины или снятие сердечка
     * создавало ключ, для которого кеша нет. Виджет уходил в
     * состояние загрузки, весь список подменялся скелетонами — и это
     * выглядело как перезагрузка страницы, хотя навигации не было.
     */
    placeholderData: keepPreviousData,
  });
