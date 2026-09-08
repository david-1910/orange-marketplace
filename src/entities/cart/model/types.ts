export interface CartItem {
  productId: string;
  /** Всегда ≥ 1: позиция с нулём удаляется, а не хранится. */
  quantity: number;
}

/**
 * Позиция с подставленной ценой — вход для подсчёта сумм.
 *
 * Намеренно не `Product`: сущность «корзина» не импортирует сущность
 * «товар» и знает только то, что нужно для арифметики. Собирает такие
 * записи тот, у кого есть и позиции, и товары, — виджет корзины.
 */
export interface CartPricedItem extends CartItem {
  price: number;
  /** Цена до скидки, если скидка есть. */
  oldPrice?: number;
}

export interface CartTotals {
  /** Сколько единиц товара, а не позиций. */
  count: number;
  /** Сумма по ценам без скидки — от неё считается выгода. */
  fullPrice: number;
  /** Сколько скидка сняла с полной цены. */
  discount: number;
  /** К оплате за товары, без доставки. */
  subtotal: number;
}
