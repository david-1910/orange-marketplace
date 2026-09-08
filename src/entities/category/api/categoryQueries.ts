import { queryOptions } from '@tanstack/react-query';

import { categoryKeys } from '../config/queryKeys';

import { getCategoriesRequest } from './category-api';

/**
 * Опции запроса списка категорий, общие для всех хуков слайса.
 *
 * Нужны затем, чтобы `useCategories` и `useCategory` смотрели в один
 * ключ кеша: одна категория — это выборка из уже загруженного списка
 * через `select`, а не второй сетевой запрос.
 */
export const categoriesQuery = () =>
  queryOptions({
    queryKey: categoryKeys.list(),
    queryFn: getCategoriesRequest,
  });
