import { mockLatency } from '@/shared/api';

import { PRODUCTS_PAGE_SIZE } from '../config/pagination';
import type {
  PriceRange,
  Product,
  ProductFilters,
  ProductPage,
  ProductSort,
} from '../model/types';

import { MOCK_PRODUCTS } from './mocks';

/**
 * Правила сортировки.
 *
 * Сортировка живёт в источнике, а не в компоненте: страницы приходят
 * порциями по пятнадцать, и упорядочить их на клиенте невозможно —
 * получилось бы «дешёвые внутри каждой страницы», а не «дешёвые
 * сначала». Именно так каталог и выглядел: цены шли вразнобой.
 */
const SORTERS: Record<ProductSort, (a: Product, b: Product) => number> = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating-desc': (a, b) => b.rating - a.rating,
};

/**
 * Отбор товаров по фильтрам — общая часть обоих запросов ниже.
 *
 * Вынесена отдельно, чтобы правила отбора были описаны один раз:
 * иначе постраничный запрос и запрос конечного списка фильтровали бы
 * каждый по-своему, и каталог с лентой начали бы расходиться.
 */
const filterProducts = (filters: ProductFilters): Product[] => {
  // Выборка по id идёт первой и задаёт порядок: перебираем ids, а не
  // товары, иначе избранное вернулось бы в порядке каталога и список
  // перестал бы совпадать с тем, как его собирал пользователь.
  const byIds = filters.ids
    ? filters.ids
        .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
        .filter((product): product is Product => product !== undefined)
    : MOCK_PRODUCTS;

  const byCategory = filters.categoryId
    ? byIds.filter((product) => product.categoryId === filters.categoryId)
    : byIds;

  const query = filters.query?.trim().toLowerCase();

  // Поиск по названию: приводим обе стороны к нижнему регистру, иначе
  // «iphone» не нашёл бы «iPhone». Разбиваем запрос на слова и требуем
  // все — так «найк худи» находит «Худи Nike», хотя порядок слов
  // другой.
  const queryWords = query ? query.split(/\s+/).filter(Boolean) : [];

  const byQuery = queryWords.length
    ? byCategory.filter((product) => {
        const title = product.title.toLowerCase();
        return queryWords.every((word) => title.includes(word));
      })
    : byCategory;

  const matched = byQuery.filter(
    (product) =>
      (filters.minPrice === undefined || product.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || product.price <= filters.maxPrice) &&
      (filters.minRating === undefined || product.rating >= filters.minRating),
  );

  if (!filters.sort) return matched;

  // Сортируем копию: filter уже вернул новый массив, но полагаться на
  // это нельзя — при выборке по ids порядок задаёт вызывающий, и
  // мутация испортила бы его.
  return [...matched].sort(SORTERS[filters.sort]);
};

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

  const products = filterProducts(filters);

  // Лимит применяет источник данных, а не компонент: иначе главная
  // качала бы весь каталог, чтобы показать первые десять товаров.
  return filters.limit ? products.slice(0, filters.limit) : products;
};

/**
 * Одна страница каталога. Нумерация с единицы.
 *
 * Возвращает и `nextPage`, и `total`: первое нужно бесконечной ленте,
 * чтобы знать, где остановиться, второе — счётчику «показано N из M».
 * Считать их на клиенте нельзя: клиент видит только загруженные
 * страницы и о размере всего каталога не знает.
 */
export const getProductsPageRequest = async (
  filters: ProductFilters = {},
  page = 1,
): Promise<ProductPage> => {
  await mockLatency();

  const products = filterProducts(filters);
  const start = (page - 1) * PRODUCTS_PAGE_SIZE;
  const items = products.slice(start, start + PRODUCTS_PAGE_SIZE);

  return {
    items,
    nextPage: start + items.length < products.length ? page + 1 : null,
    total: products.length,
  };
};

export const getProductRequest = async (id: string): Promise<Product> => {
  await mockLatency();

  const product = MOCK_PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error(`Товар "${id}" не найден`);

  return product;
};

/**
 * Границы цен по всему каталогу.
 *
 * Считаются по всем товарам, а не по текущей выборке: слайдер должен
 * стоять на месте при смене категории, иначе его концы прыгают и
 * выставленный диапазон каждый раз обнуляется.
 */
export const getPriceRangeRequest = async (): Promise<PriceRange> => {
  await mockLatency();

  const prices = MOCK_PRODUCTS.map((product) => product.price);

  return { min: Math.min(...prices), max: Math.max(...prices) };
};
