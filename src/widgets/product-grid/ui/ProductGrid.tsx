import { useMemo, type ReactNode } from 'react';

import { type ProductFilters, useProducts } from '@/entities/product';

import { ProductGridView } from './ProductGridView';

export interface ProductGridProps {
  categoryId: string | null;
  /**
   * Показать только эти товары — так страницу избранного собирает
   * тот же виджет, что и каталог. Пустой массив означает «нечего
   * показывать», а не «показать всё».
   */
  ids?: string[];
  /** Сколько товаров показать. Без лимита — все. */
  limit?: number;
  /**
   * Чем заполнить пустую сетку. По умолчанию — текст про категорию,
   * но у избранного своя причина пустоты, поэтому она приходит
   * снаружи.
   */
  emptyState?: ReactNode;
}

/** Пропсы виджета в фильтры запроса: лимит режет источник, а не клиент. */
const toFilters = ({
  categoryId,
  ids,
  limit,
}: ProductGridProps): ProductFilters => ({
  ...(categoryId ? { categoryId } : {}),
  ...(ids ? { ids } : {}),
  ...(limit ? { limit } : {}),
});

/**
 * Конечный список товаров: главная с лимитом, избранное по списку id.
 *
 * Для каталога есть ProductFeed — там лента подгружается страницами.
 */
export function ProductGrid({
  categoryId,
  ids,
  limit,
  emptyState,
}: ProductGridProps) {
  const { data, isLoading, isError, refetch } = useProducts(
    toFilters({ categoryId, ids, limit }),
  );

  /**
   * Пока едет ответ на новый список ids, показываются прежние
   * данные — иначе сетка мигала бы скелетонами на каждое снятие
   * сердечка. Но прежние данные содержат уже убранный товар,
   * поэтому сверяем их с актуальным списком: карточка исчезает
   * сразу по клику, а не через задержку запроса.
   */
  const products = useMemo(
    () => (ids && data ? data.filter((item) => ids.includes(item.id)) : data),
    [ids, data],
  );

  return (
    <ProductGridView
      products={products}
      // Именно isLoading, а не isPending: при пустом списке ids запрос
      // отключён и остаётся pending навсегда, поэтому по isPending
      // сетка показывала бы скелетоны вечно вместо пустого состояния.
      isLoading={isLoading}
      isError={isError}
      onRetry={() => void refetch()}
      skeletonCount={limit ?? 10}
      {...(emptyState ? { emptyState } : {})}
    />
  );
}
