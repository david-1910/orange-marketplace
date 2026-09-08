import { useQuery } from '@tanstack/react-query';

import { categoriesQuery } from '../api/categoryQueries';

/**
 * Одна категория по идентификатору.
 *
 * Выбирается из того же списка, что и `useCategories`: ключ кеша
 * общий, поэтому второго запроса не уходит, а поиск нужной категории
 * не приходится повторять в каждом ui, которому она понадобилась.
 *
 * Возвращает null, если категории с таким id нет.
 */
export const useCategory = (id: string | undefined) =>
  useQuery({
    ...categoriesQuery(),
    enabled: Boolean(id),
    select: (categories) =>
      categories.find((category) => category.id === id) ?? null,
  });
