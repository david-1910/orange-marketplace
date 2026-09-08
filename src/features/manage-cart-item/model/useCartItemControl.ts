import { useCallback } from 'react';

import { useCartActions, useCartQuantity } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { notify } from '@/shared/lib';

export interface CartItemControlState {
  /** 0 — товара в корзине нет, показываем кнопку «В корзину». */
  quantity: number;
  isUnavailable: boolean;
  /** Подпись кнопки, пока товара в корзине нет. */
  label: string;
  add: () => void;
  increment: () => void;
  /** На единице удаляет позицию целиком. */
  decrement: () => void;
}

/**
 * Сценарий «управлять этим товаром в корзине»: положить, изменить
 * количество, убрать.
 *
 * Один слайс, а не два (add-to-cart + change-quantity), потому что
 * решение «показать кнопку или степпер» должно приниматься в одном
 * месте. Разнеси их по двум фичам — и это условие продублируется в
 * сетке каталога, на странице товара и в списке корзины.
 */
export const useCartItemControl = (product: Product): CartItemControlState => {
  const quantity = useCartQuantity(product.id);
  const { add, increment, decrement } = useCartActions();

  const isUnavailable = !product.inStock;

  return {
    quantity,
    isUnavailable,
    label: isUnavailable ? 'Нет в наличии' : 'В корзину',
    add: useCallback(() => {
      if (!product.inStock) return;

      add(product.id);
      notify.success('Товар в корзине');
    }, [add, product.id, product.inStock]),

    increment: useCallback(
      () => increment(product.id),
      [increment, product.id],
    ),

    /**
     * Сообщаем только про удаление позиции, а не про каждое
     * уменьшение: тост на каждый клик по минусу превратился бы в
     * очередь уведомлений, пока человек убирает пять штук.
     *
     * Возврат кнопкой в уведомлении добавляет одну штуку, а не
     * прежнее количество: удаляется позиция всегда с единицы, потому
     * что минус на большем количестве просто уменьшает её.
     */
    decrement: useCallback(() => {
      decrement(product.id);

      if (quantity <= 1) {
        notify.undo('Убрано из корзины', () => add(product.id));
      }
    }, [decrement, add, product.id, quantity]),
  };
};
