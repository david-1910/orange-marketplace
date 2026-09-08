import type { Promo } from '../model/types';

/**
 * Скидка по промокоду с учётом её потолка.
 *
 * Живёт в сущности, а не в фиче: сумму скидки считает и оформление, и
 * правило округления должно быть одним для всех, кто её показывает.
 */
export const calcPromoDiscount = (promo: Promo, subtotal: number): number =>
  Math.min(Math.round((subtotal * promo.percent) / 100), promo.maxDiscount);
