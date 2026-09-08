import { mockLatency } from '@/shared/api';

export interface Promo {
  code: string;
  /** Скидка в процентах от суммы товаров. */
  percent: number;
  /** Больше этой суммы промокод не снимает. */
  maxDiscount: number;
}

/**
 * Промокоды магазина. Пока фикстуры: единственное место, которое
 * поменяется при появлении бэкенда, — тело функции ниже.
 */
const MOCK_PROMOS: Promo[] = [
  { code: 'ORANGE20', percent: 20, maxDiscount: 2_000_000 },
  { code: 'FIRST', percent: 10, maxDiscount: 500_000 },
  { code: 'TASHKENT', percent: 5, maxDiscount: 300_000 },
];

/** Промокод по коду; null — такого нет. Регистр не важен. */
export const findPromoRequest = async (code: string): Promise<Promo | null> => {
  await mockLatency();

  const normalized = code.trim().toUpperCase();

  return MOCK_PROMOS.find((promo) => promo.code === normalized) ?? null;
};
