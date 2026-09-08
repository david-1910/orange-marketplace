/** Фабрика ключей кеша отзывов. Наружу из слайса не экспортируется. */
export const reviewKeys = {
  all: ['review'] as const,
  list: (productId: string) => [...reviewKeys.all, 'list', productId] as const,
};
