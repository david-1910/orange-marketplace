import { useQuery } from '@tanstack/react-query';

import { getPriceRangeRequest } from '../api/product-api';
import { productKeys } from '../config/queryKeys';

/**
 * Границы цен каталога — концы слайдера диапазона.
 *
 * Отдельный запрос со своим ключом: он не зависит от выбранных
 * фильтров, поэтому кешируется один раз и не перезапрашивается при
 * каждой смене категории.
 */
export const usePriceRange = () =>
  useQuery({
    queryKey: productKeys.priceRange(),
    queryFn: getPriceRangeRequest,
  });
