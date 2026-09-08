import { useCallback } from 'react';

import { useFavoriteActions, useIsFavorite } from '@/entities/favorite';

export interface ToggleFavorite {
  isFavorite: boolean;
  /** Подпись для скринридера: состояние иконки на слух не читается. */
  label: string;
  toggle: () => void;
}

/**
 * Сценарий «добавить товар в избранное или убрать из него».
 *
 * Подписка точечная: useIsFavorite отдаёт boolean по одному id,
 * поэтому карточка не перерисовывается, когда сердечко нажали
 * у соседнего товара.
 */
export const useToggleFavorite = (productId: string): ToggleFavorite => {
  const isFavorite = useIsFavorite(productId);
  const { toggle } = useFavoriteActions();

  return {
    isFavorite,
    label: isFavorite ? 'Убрать из избранного' : 'В избранное',
    toggle: useCallback(() => toggle(productId), [toggle, productId]),
  };
};
