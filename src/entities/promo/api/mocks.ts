import type { Promo } from '../model/types';

/**
 * Промокоды магазина.
 *
 * Лежат в сущности, а не внутри фичи применения: те же коды показывает
 * баннер в каталоге, и держать их в двух местах значило бы, что
 * баннер однажды начнёт обещать код, которого касса не знает.
 */
export const MOCK_PROMOS: Promo[] = [
  {
    code: 'ORANGE20',
    percent: 20,
    maxDiscount: 2_000_000,
    hint: 'до 2 млн сум',
  },
  { code: 'FIRST', percent: 10, maxDiscount: 500_000, hint: 'на первый заказ' },
  { code: 'TASHKENT', percent: 5, maxDiscount: 300_000, hint: 'по Ташкенту' },
];
