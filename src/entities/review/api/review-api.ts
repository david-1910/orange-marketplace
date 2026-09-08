import { mockLatency } from '@/shared/api';

import type { Review } from '../model/types';

import { REVIEW_AUTHORS, REVIEW_TEMPLATES } from './mocks';

/**
 * Простая устойчивая хеш-функция от строки.
 *
 * Нужна, чтобы отзывы у одного товара не менялись между заходами:
 * Math.random() выдавал бы каждый раз новых авторов и новые даты, и
 * страница выглядела бы сломанной. Криптостойкость здесь не нужна —
 * нужна только повторяемость.
 */
const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Отзывы товара.
 *
 * Единственное место, которое поменяется с появлением бэкенда: тело
 * функции станет запросом, сигнатура и форма ответа останутся.
 */
export const getReviewsRequest = async (
  productId: string,
): Promise<Review[]> => {
  await mockLatency();

  const seed = hashString(productId);

  return REVIEW_TEMPLATES.map((template, index) => ({
    id: `${productId}-${index}`,
    author: REVIEW_AUTHORS[(seed + index * 3) % REVIEW_AUTHORS.length]!,
    rating: template.rating,
    text: template.text,
    // Отзывы идут от свежих к старым, с разбросом в несколько дней.
    createdAt: new Date(
      Date.now() - ((seed % 5) + index * 4 + 1) * DAY_MS,
    ).toISOString(),
    // Каждый второй — с подтверждённой покупкой.
    isVerified: (seed + index) % 2 === 0,
  }));
};
