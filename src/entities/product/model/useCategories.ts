import { useQuery } from '@tanstack/react-query';

import { getCategoriesRequest } from '../api/product-api';
import { categoryKeys } from '../config/queryKeys';

/** Список категорий каталога. */
export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategoriesRequest,
  });
