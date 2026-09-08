import { useCallback } from 'react';

import { useFavoriteActions, useIsFavorite } from '@/entities/favorite';
import { notify } from '@/shared/lib';

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
    /**
     * Уведомление живёт здесь, в модели сценария, а не в кнопке:
     * сердечко стоит и в карточке, и в строке корзины, и в двух местах
     * пришлось бы повторять один и тот же текст.
     *
     * Убранное из избранного возвращается кнопкой в уведомлении: клик
     * по сердечку легко сделать случайно, а собранный список жаль.
     */
    toggle: useCallback(() => {
      toggle(productId);

      if (isFavorite) {
        notify.undo('Убрано из избранного', () => toggle(productId));
      } else {
        notify.info('Добавлено в избранное');
      }
    }, [toggle, productId, isFavorite]),
  };
};
