import { useMemo } from 'react';

import {
  type CartPricedItem,
  type CartTotals,
  calcCartTotals,
  useCartItems,
  useCartProductIds,
} from '@/entities/cart';
import { type Product, useProducts } from '@/entities/product';

export interface CartRow extends CartPricedItem {
  product: Product;
}

export interface CartRows {
  rows: CartRow[];
  /** Суммы по всей корзине. */
  totals: CartTotals;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Позиции корзины, склеенные с данными товаров, и суммы по ним.
 *
 * Живёт в виджете, а не в сущности: связка двух сущностей — работа
 * слоя выше. `entities/cart` хранит только id и количества и не имеет
 * права импортировать `entities/product`.
 *
 * Экспортируется из публичного API виджета, потому что то же самое
 * нужно и странице корзины, и оформлению заказа. Второй копии этой
 * склейки в проекте быть не должно: пересчёт сумм в двух местах — это
 * ровно тот случай, когда цифры в корзине и в чеке начинают
 * расходиться.
 */
export const useCartRows = (): CartRows => {
  const items = useCartItems();
  const productIds = useCartProductIds();

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    ids: productIds,
  });

  const rows = useMemo<CartRow[]>(() => {
    if (!products) return [];

    // Идём по позициям, а не по товарам: порядок корзины задают
    // позиции, а товар для позиции может и не найтись, если его
    // убрали из каталога.
    return items.flatMap((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId,
      );

      if (!product) return [];

      return [
        {
          ...item,
          product,
          price: product.price,
          ...(product.oldPrice ? { oldPrice: product.oldPrice } : {}),
        },
      ];
    });
  }, [items, products]);

  const totals = useMemo(() => calcCartTotals(rows), [rows]);

  return { rows, totals, isLoading, isError, refetch: () => void refetch() };
};
