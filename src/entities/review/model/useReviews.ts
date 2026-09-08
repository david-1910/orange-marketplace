import { useQuery } from '@tanstack/react-query';

import { getReviewsRequest } from '../api/review-api';
import { reviewKeys } from '../config/queryKeys';

/** Отзывы товара. Без id запрос не уходит. */
export const useReviews = (productId: string | undefined) =>
  useQuery({
    queryKey: reviewKeys.list(productId ?? ''),
    queryFn: () => getReviewsRequest(productId ?? ''),
    enabled: Boolean(productId),
  });
