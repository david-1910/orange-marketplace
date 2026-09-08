import { useCallback, useState } from 'react';

import type { Product } from '@/entities/product';

export type CartState = 'unavailable' | 'added' | 'idle';

/**
 * Подписи объявлены одним словарём. Раньше текст кнопки и подпись
 * курсора считались двумя независимыми тернарниками, и над
 * недоступным товаром курсор предлагал «в корзину», хотя кнопка
 * говорила «нет в наличии».
 */
const STATE_LABELS: Record<CartState, string> = {
  unavailable: 'Нет в наличии',
  added: 'Добавлено',
  idle: 'В корзину',
};

export interface AddToCart {
  state: CartState;
  /** Одна подпись и для кнопки, и для курсора. */
  label: string;
  isUnavailable: boolean;
  add: () => void;
}

/**
 * Сценарий «положить товар в корзину».
 *
 * Состояние пока локальное: entities/cart появится вместе с
 * корзиной, и тогда здесь встанет настоящая мутация. Наружу хук
 * отдаёт готовое состояние и одно действие, поэтому ui при этом
 * не изменится — поменяется только внутренность хука.
 */
export const useAddToCart = (product: Product): AddToCart => {
  const [isAdded, setIsAdded] = useState(false);

  const state: CartState = !product.inStock
    ? 'unavailable'
    : isAdded
      ? 'added'
      : 'idle';

  const isUnavailable = state === 'unavailable';

  const add = useCallback(() => {
    if (product.inStock) setIsAdded(true);
  }, [product.inStock]);

  return { state, label: STATE_LABELS[state], isUnavailable, add };
};
