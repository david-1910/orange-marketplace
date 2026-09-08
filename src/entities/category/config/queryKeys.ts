/**
 * Фабрика ключей кеша категорий.
 *
 * Лежит в config, а не в api: это набор констант, а не запрос.
 * Наружу из слайса не экспортируется — инвалидация кеша сущности
 * остаётся её собственным делом.
 */
export const categoryKeys = {
  all: ['category'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};
