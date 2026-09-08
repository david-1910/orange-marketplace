import { useShallow } from 'zustand/react/shallow';

import { type OrderActions, useOrderStore } from './orderStore';
import type { Order } from './types';

/** Все заказы браузера, свежие сверху. */
export const useOrders = (): Order[] => useOrderStore((state) => state.orders);

/**
 * Заказы одного покупателя — по номеру, на который они оформлены.
 *
 * Именно так «мои заказы» и должны определяться: без привязки профиль
 * показывал всё, что оформлено в этом браузере, поэтому после выхода и
 * входа под другим номером человек видел чужую историю.
 *
 * Удалять заказы при выходе — неверная замена этой фильтрации: заказ
 * это документ об уже оплаченной покупке, и терять его из-за нажатия
 * «Выйти» нельзя. Здесь он просто перестаёт показываться тому, кому не
 * принадлежит.
 *
 * useShallow обязателен: filter отдаёт новый массив на каждый вызов, а
 * zustand кладёт результат селектора в useSyncExternalStore, который
 * требует стабильный снапшот.
 */
export const useOrdersByPhone = (phone: string | undefined): Order[] =>
  useOrderStore(
    useShallow((state) =>
      phone
        ? state.orders.filter((order) => order.recipient.phone === phone)
        : [],
    ),
  );

/** Один заказ по id; null — такого заказа нет. */
export const useOrder = (id: string | undefined): Order | null =>
  useOrderStore(
    (state) => state.orders.find((order) => order.id === id) ?? null,
  );

/** Экшены заказов одной стабильной ссылкой. */
export const useOrderActions = (): OrderActions =>
  useOrderStore((state) => state.actions);
