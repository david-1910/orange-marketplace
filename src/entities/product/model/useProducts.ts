import { useQuery } from '@tanstack/react-query';

import { getProductsRequest } from '../api/product-api';
import { productKeys } from '../config/queryKeys';
import type { ProductFilters } from './types';

/** Список товаров, при необходимости отфильтрованный по категории. */
export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProductsRequest(filters),
  });
