import { mockLatency } from '@/shared/api';

import type { Product, ProductFilters } from '../model/types';

import { MOCK_PRODUCTS } from './mocks';

/**
 * Здесь и ниже — единственное место, которое поменяется при появлении
 * бэкенда: тело функции станет вызовом baseAxios, сигнатура останется.
 * Хуки и компоненты об источнике данных не знают.
 *
 * Ошибки намеренно не глотаются: если запрос упал, промис должен
 * отклониться, иначе useQuery посчитает пустой массив успехом и
 * показать состояние ошибки станет невозможно.
 */
export const getProductsRequest = async (
  filters: ProductFilters = {},
): Promise<Product[]> => {
  await mockLatency();

  const byCategory = filters.categoryId
    ? MOCK_PRODUCTS.filter(
        (product) => product.categoryId === filters.categoryId,
      )
    : MOCK_PRODUCTS;

  // Лимит применяет источник данных, а не компонент: иначе главная
  // качала бы весь каталог, чтобы показать первые десять товаров.
  return filters.limit ? byCategory.slice(0, filters.limit) : byCategory;
};

export const getProductRequest = async (id: string): Promise<Product> => {
  await mockLatency();

  const product = MOCK_PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error(`Товар "${id}" не найден`);

  return product;
};
