import type { CartPricedItem, CartTotals } from '../model/types';

/**
 * Суммы по корзине.
 *
 * Чистая функция от позиций с ценами: её используют и корзина, и
 * оформление, и создание заказа — арифметика описана один раз.
 *
 * На вход идёт `CartPricedItem`, а не `Product`: сущность «корзина»
 * не импортирует сущность «товар». Цену подставляет тот, у кого есть
 * и позиции, и каталог.
 *
 * `fullPrice` считается по `oldPrice`, если она есть, иначе по
 * текущей цене — иначе у товара без скидки выгода получалась бы
 * отрицательной.
 */
export const calcCartTotals = (items: CartPricedItem[]): CartTotals =>
  items.reduce<CartTotals>(
    (totals, item) => {
      const full = (item.oldPrice ?? item.price) * item.quantity;
      const paid = item.price * item.quantity;

      return {
        count: totals.count + item.quantity,
        fullPrice: totals.fullPrice + full,
        discount: totals.discount + (full - paid),
        subtotal: totals.subtotal + paid,
      };
    },
    { count: 0, fullPrice: 0, discount: 0, subtotal: 0 },
  );
