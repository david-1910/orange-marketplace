import type { ProductFilters } from './product-requests';

/**
 * Фабрика ключей кеша. Иерархия важна: инвалидация по productKeys.all
 * сбрасывает и списки, и карточки товаров одним вызовом.
 */
export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['category'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};
