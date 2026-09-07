import { useQuery } from '@tanstack/react-query';

import { categoryKeys, productKeys } from './product-keys';
import {
  getCategoriesRequest,
  getProductRequest,
  getProductsRequest,
  type ProductFilters,
} from './product-requests';

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProductsRequest(filters),
  });

export const useProduct = (id: string | undefined) =>
  useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => getProductRequest(id ?? ''),
    enabled: Boolean(id),
  });

export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategoriesRequest,
  });
