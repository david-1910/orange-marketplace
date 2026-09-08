import { mockLatency } from '@/shared/api';

import type { Promo } from '../model/types';

import { MOCK_PROMOS } from './mocks';

/**
 * Единственное место, которое поменяется при появлении бэкенда: тела
 * функций станут запросами, сигнатуры останутся.
 */
export const getPromosRequest = async (): Promise<Promo[]> => {
  await mockLatency();

  return MOCK_PROMOS;
};

/** Промокод по коду; null — такого нет. Регистр не важен. */
export const findPromoRequest = async (code: string): Promise<Promo | null> => {
  await mockLatency();

  const normalized = code.trim().toUpperCase();

  return MOCK_PROMOS.find((promo) => promo.code === normalized) ?? null;
};
