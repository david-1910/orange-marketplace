import { useQuery } from '@tanstack/react-query';

import { getPromosRequest } from '../api/promo-api';
import { promoKeys } from '../config/queryKeys';

/** Действующие промокоды — их показывает баннер в каталоге. */
export const usePromos = () =>
  useQuery({
    queryKey: promoKeys.list(),
    queryFn: getPromosRequest,
  });
