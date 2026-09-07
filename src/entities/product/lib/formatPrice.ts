import type { Product } from '../model/types';

const PRICE_FORMATTER = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

/** 15990000 → «15 990 000 сум». */
export const formatPrice = (value: number): string =>
  `${PRICE_FORMATTER.format(value)} сум`;

/**
 * Размер скидки в процентах для бейджа: 15990000 при старой 17490000 → 9.
 * Возвращает null, если скидки нет — бейдж тогда не рендерится.
 */
export const getDiscountPercent = ({
  price,
  oldPrice,
}: Product): number | null => {
  if (!oldPrice || oldPrice <= price) return null;

  return Math.round((1 - price / oldPrice) * 100);
};
