import { type OrderActions, useOrderStore } from './orderStore';
import type { Order } from './types';

/** История заказов, свежие сверху. */
export const useOrders = (): Order[] => useOrderStore((state) => state.orders);

/** Один заказ по id; null — такого заказа нет. */
export const useOrder = (id: string | undefined): Order | null =>
  useOrderStore(
    (state) => state.orders.find((order) => order.id === id) ?? null,
  );

/** Экшены заказов одной стабильной ссылкой. */
export const useOrderActions = (): OrderActions =>
  useOrderStore((state) => state.actions);
