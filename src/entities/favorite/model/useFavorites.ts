import { type FavoriteActions, useFavoriteStore } from './favoriteStore';

/** Идентификаторы избранных товаров, свежие сверху. */
export const useFavoriteIds = (): string[] =>
  useFavoriteStore((state) => state.ids);

/** Сколько товаров в избранном — для счётчика в хедере. */
export const useFavoriteCount = (): number =>
  useFavoriteStore((state) => state.ids.length);

/**
 * В избранном ли конкретный товар.
 *
 * Отдельный хук с точечным селектором, а не `ids.includes(...)` в
 * компоненте: селектор возвращает boolean, поэтому карточка
 * перерисовывается только когда меняется её собственное состояние,
 * а не при любом изменении списка.
 */
export const useIsFavorite = (productId: string): boolean =>
  useFavoriteStore((state) => state.ids.includes(productId));

/** Экшены избранного одной стабильной ссылкой. */
export const useFavoriteActions = (): FavoriteActions =>
  useFavoriteStore((state) => state.actions);
