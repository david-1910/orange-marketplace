import { useQuery } from '@tanstack/react-query';

import { getProductRequest } from '../api/product-api';
import { productKeys } from '../config/queryKeys';

/** Один товар по идентификатору. Без id запрос не уходит. */
export const useProduct = (id: string | undefined) =>
  useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => getProductRequest(id ?? ''),
    enabled: Boolean(id),
  });
