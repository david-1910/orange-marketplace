/** Фабрика ключей кеша промокодов. Наружу из слайса не экспортируется. */
export const promoKeys = {
  all: ['promo'] as const,
  list: () => [...promoKeys.all, 'list'] as const,
};
