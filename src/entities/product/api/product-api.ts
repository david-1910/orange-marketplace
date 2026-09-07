import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../model/mocks';
import type { Category, Product, ProductFilters } from '../model/types';

/** Имитация сетевой задержки, чтобы состояния загрузки были видны. */
const MOCK_LATENCY = 350;

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

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
  await delay(MOCK_LATENCY);

  if (!filters.categoryId) return MOCK_PRODUCTS;

  return MOCK_PRODUCTS.filter(
    (product) => product.categoryId === filters.categoryId,
  );
};

export const getProductRequest = async (id: string): Promise<Product> => {
  await delay(MOCK_LATENCY);

  const product = MOCK_PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error(`Товар "${id}" не найден`);

  return product;
};

export const getCategoriesRequest = async (): Promise<Category[]> => {
  await delay(MOCK_LATENCY);

  return MOCK_CATEGORIES;
};
