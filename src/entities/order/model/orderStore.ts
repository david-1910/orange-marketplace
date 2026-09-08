import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Order, OrderDraft } from './types';

/** Доменное слово в ключе, поэтому он живёт в слайсе, а не в shared. */
const STORAGE_KEY = 'orange-orders';

export interface OrderActions {
  /** Создать заказ и вернуть его — вызывающему нужен id для перехода. */
  create: (draft: OrderDraft) => Order;
  clear: () => void;
}

interface OrderState {
  orders: Order[];
  actions: OrderActions;
}

/**
 * Номер заказа для человека: 8 цифр, как в квитанции.
 *
 * Дата в основе, чтобы номера шли по возрастанию, плюс случайный
 * хвост — иначе два заказа в одну секунду получили бы один номер.
 */
const createOrderNumber = (): string => {
  const stamp = Date.now().toString().slice(-6);
  const tail = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  return `${stamp}${tail}`;
};

/**
 * История заказов.
 *
 * Заказ приходит готовым снимком: сущность «заказ» не импортирует ни
 * корзину, ни пользователя, ни товары. Собирает черновик фича
 * оформления — это её работа, она и так знает про все три сущности.
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],

      actions: {
        create: (draft) => {
          const order: Order = {
            ...draft,
            id: crypto.randomUUID(),
            number: createOrderNumber(),
            createdAt: new Date().toISOString(),
          };

          // Свежий заказ первым: в профиле история читается сверху.
          set((state) => ({ orders: [order, ...state.orders] }));

          return order;
        },

        clear: () => set({ orders: [] }),
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
);
