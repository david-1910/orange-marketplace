import { mockLatency } from '@/shared/api';

import type { Category } from '../model/types';

import { MOCK_CATEGORIES } from './mocks';

/**
 * Единственное место, которое поменяется при появлении бэкенда:
 * тело функции станет вызовом baseAxios, сигнатура останется.
 * Хуки и компоненты об источнике данных не знают.
 */
export const getCategoriesRequest = async (): Promise<Category[]> => {
  await mockLatency();

  return MOCK_CATEGORIES;
};
