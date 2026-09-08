// Доменные слова в сегментах URL (`product`, `catalog`) остаются
// осознанно: реестр адресов — это конфигурация адресного пространства
// приложения, а не бизнес-логика. Переименование в недоменные пути
// испортило бы адреса и SEO, а вынос реестра в app заставил бы
// прокидывать каждую ссылку пропсом через все слои.
//
// Что отсюда ушло: правило «каталог фильтруется по категории»
// (query-параметр и сборка ссылки с фильтром) — это уже знание
// сущности, оно живёт в entities/category/config/catalogLink.ts.
// Тем, кому нужен просто каталог, хватает ROUTES.catalog.

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
  favorites: '/favorites',
  cart: '/cart',
  checkout: '/checkout',
  order: '/order/:id',
  profile: '/profile',
} as const;

export type TRoutePattern = (typeof ROUTES)[keyof typeof ROUTES];

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
