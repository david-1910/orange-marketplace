import { ROUTES } from '@/shared/config';

/**
 * Знание «каталог фильтруется по категории» живёт здесь, а не в
 * shared/config: это доменное правило сущности, а не адресное
 * пространство приложения. В shared остался только реестр путей.
 *
 * Тем, кому нужен просто каталог, хватает ROUTES.catalog — импорт
 * сущности ради строки URL им не нужен.
 */

/** Имя query-параметра с выбранной категорией каталога. */
export const CATALOG_CATEGORY_PARAM = 'category';

/** Ссылка на каталог, сразу отфильтрованный по категории. */
export const buildCatalogCategoryPath = (categoryId: string): string =>
  `${ROUTES.catalog}?${CATALOG_CATEGORY_PARAM}=${encodeURIComponent(categoryId)}`;
