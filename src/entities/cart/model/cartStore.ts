import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem } from './types';

/**
 * Ключ хранилища объявлен здесь, а не в общем реестре в shared:
 * «cart» — доменное слово, а shared о домене знать не должен.
 */
const STORAGE_KEY = 'orange-cart';

export interface CartActions {
  /** Положить товар. Повторный вызов увеличивает количество. */
  add: (productId: string) => void;
  increment: (productId: string) => void;
  /**
   * Уменьшить количество. На единице позиция удаляется целиком —
   * это требование сценария: «когда остался один и отнимается,
   * из корзины удаляется».
   */
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  removeMany: (productIds: string[]) => void;
  clear: () => void;
}

interface CartState {
  items: CartItem[];
  /**
   * Экшены собраны одним вложенным объектом: zustand 5 не сравнивает
   * результат селектора shallow, поэтому селектор, собирающий новый
   * объект, перерисовывал бы компонент на любое изменение стора.
   */
  actions: CartActions;
}

/** Прибавить к количеству одной позиции, не задев остальные. */
const changeQuantity = (
  items: CartItem[],
  productId: string,
  delta: number,
): CartItem[] =>
  items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + delta }
      : item,
  );

/**
 * Корзина — состояние, которым владеет клиент, поэтому zustand, а не
 * react-query: react-query в проекте отвечает только за данные
 * каталога «с сервера».
 *
 * Хранятся идентификаторы и количества. Ни цен, ни названий: они
 * принадлежат сущности «товар», и дублировать их здесь значило бы
 * держать вторую копию каталога, которая разъезжается с первой.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      actions: {
        add: (productId) =>
          set((state) =>
            state.items.some((item) => item.productId === productId)
              ? { items: changeQuantity(state.items, productId, 1) }
              : // Новая позиция встаёт первой: в корзине сверху то,
                // что положили последним.
                { items: [{ productId, quantity: 1 }, ...state.items] },
          ),

        increment: (productId) =>
          set((state) => ({
            items: changeQuantity(state.items, productId, 1),
          })),

        decrement: (productId) =>
          set((state) => {
            const item = state.items.find(
              (candidate) => candidate.productId === productId,
            );

            if (!item) return state;

            return item.quantity <= 1
              ? {
                  items: state.items.filter(
                    (candidate) => candidate.productId !== productId,
                  ),
                }
              : { items: changeQuantity(state.items, productId, -1) };
          }),

        remove: (productId) =>
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          })),

        removeMany: (productIds) =>
          set((state) => ({
            items: state.items.filter(
              (item) => !productIds.includes(item.productId),
            ),
          })),

        clear: () => set({ items: [] }),
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
