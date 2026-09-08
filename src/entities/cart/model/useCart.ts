import { useShallow } from 'zustand/react/shallow';

import { type CartActions, useCartStore } from './cartStore';
import type { CartItem } from './types';

/** Позиции корзины, свежие сверху. */
export const useCartItems = (): CartItem[] =>
  useCartStore((state) => state.items);

/**
 * Идентификаторы позиций — ими список и сводка запрашивают товары.
 *
 * Через useShallow, потому что селектор собирает новый массив:
 * zustand отдаёт результат в useSyncExternalStore, а тот требует
 * стабильный снапшот и на новой ссылке каждый раз ругается
 * «getSnapshot should be cached». useShallow сравнивает поэлементно
 * и держит прежнюю ссылку, пока состав не изменился.
 */
export const useCartProductIds = (): string[] =>
  useCartStore(
    useShallow((state) => state.items.map((item) => item.productId)),
  );

/**
 * Сколько единиц товара в корзине — для бейджа в хедере.
 *
 * Считаем единицы, а не позиции: две штуки одного товара в бейдже
 * должны читаться как «2», иначе счётчик расходится с суммой в
 * корзине.
 */
export const useCartCount = (): number =>
  useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0),
  );

/**
 * Количество одного товара, 0 — если его в корзине нет.
 *
 * Точечный селектор: контрол на карточке перерисовывается только
 * когда меняется его собственное количество, а не при любой правке
 * корзины.
 */
export const useCartQuantity = (productId: string): number =>
  useCartStore(
    (state) =>
      state.items.find((item) => item.productId === productId)?.quantity ?? 0,
  );

/** Экшены корзины одной стабильной ссылкой. */
export const useCartActions = (): CartActions =>
  useCartStore((state) => state.actions);
