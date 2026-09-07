// TODO: требует решения — доменные слова в shared.
//
// Регламент запрещает слова `product` и `category` в слое shared, и
// формально этот файл его нарушает. Перенос путей в
// entities/product/config сделал бы хуже: тогда widgets/footer, чтобы
// поставить ссылку на каталог, был бы обязан импортировать
// entities/product, а фичи и страницы получили бы зависимость от
// доменной сущности ради строки URL. Плюс `home` и `catalog` не
// принадлежат сущности «товар» вообще.
//
// Варианты, если решим убрать нарушение полностью:
//   1) переименовать сегменты URL в недоменные (`/item/:id`) —
//      портит адреса для пользователя и SEO;
//   2) держать реестр путей в app и передавать вниз пропсами —
//      каждая ссылка станет пропсом через все слои;
//   3) считать роутинг инфраструктурой и оставить как есть.
// По умолчанию выбран третий вариант.

/**
 * Единственный источник правды по адресам страниц.
 *
 * Лежит в shared, чтобы виджеты и фичи могли строить ссылки без
 * импорта из app — импорт вверх по слоям запрещён.
 *
 * Товар живёт по двум адресам осознанно: вложенный
 * /catalog/product/:id держит каталог смонтированным, поэтому
 * работает layoutId-перелёт изображения. Прямой /product/:id нужен
 * для захода по ссылке, когда каталога в дереве нет.
 */
export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  catalogProduct: '/catalog/product/:id',
  product: '/product/:id',
} as const;

export type TRoutePattern = (typeof ROUTES)[keyof typeof ROUTES];

/** Имя query-параметра с выбранной категорией каталога. */
export const CATALOG_CATEGORY_PARAM = 'category';

/**
 * Ссылка на каталог, при необходимости сразу отфильтрованный.
 * Нужна и главной (переход по категории), и самому каталогу.
 */
export const buildCatalogPath = (categoryId?: string): string =>
  categoryId
    ? `${ROUTES.catalog}?${CATALOG_CATEGORY_PARAM}=${encodeURIComponent(categoryId)}`
    : ROUTES.catalog;

/** Имена параметров, вытащенные из шаблона роута. */
type TRouteParams<TPattern extends string> =
  TPattern extends `${string}:${infer TParam}/${infer TRest}`
    ? TParam | TRouteParams<TRest>
    : TPattern extends `${string}:${infer TParam}`
      ? TParam
      : never;

/**
 * Подставляет параметры в шаблон: ROUTES.product + { id: '7' } → '/product/7'.
 * Имена параметров проверяются компилятором.
 */
export const buildPath = <TPattern extends TRoutePattern>(
  pattern: TPattern,
  params: Record<TRouteParams<TPattern>, string>,
): string => {
  // Object.entries над generic Record теряет тип значения,
  // поэтому сужаем его здесь — снаружи типы уже проверены.
  const entries = Object.entries(params) as [string, string][];

  return entries.reduce<string>(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    pattern,
  );
};
