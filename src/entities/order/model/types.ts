export type DeliveryMethod = 'pickup' | 'courier';

export type PaymentMethod = 'card' | 'installment' | 'onDelivery';

/**
 * Стадии заказа. Выводятся из времени создания, а не хранятся:
 * см. lib/orderStatus.ts.
 */
export type OrderStatus = 'assembling' | 'delivering' | 'delivered';

/**
 * Позиция заказа — снимок товара на момент покупки.
 *
 * Именно снимок, а не ссылка на товар: цена, название и фото в
 * каталоге меняются, а чек по уже оплаченному заказу меняться не
 * должен. Поэтому здесь нет `productId` как единственного поля —
 * он есть, но лишь чтобы дать ссылку на товар, если он ещё продаётся.
 */
export interface OrderItem {
  productId: string;
  title: string;
  photoId: string;
  price: number;
  oldPrice?: number;
  quantity: number;
}

export interface OrderDelivery {
  method: DeliveryMethod;
  /** Адрес пункта выдачи или доставки. */
  address: string;
  price: number;
}

export interface OrderRecipient {
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  /** Короткий номер для человека: его называют в поддержке. */
  number: string;
  items: OrderItem[];
  /** Сумма по ценам без скидок. */
  fullPrice: number;
  /** Товарные скидки. */
  discount: number;
  /** Скидка по промокоду, если он был применён. */
  promoDiscount: number;
  promoCode?: string;
  delivery: OrderDelivery;
  payment: PaymentMethod;
  recipient: OrderRecipient;
  /** К оплате: товары минус скидки плюс доставка. */
  total: number;
  /** ISO-строка: Date в localStorage не выживает. */
  createdAt: string;
}

/** Всё, что нужно для создания заказа; id, номер и дату ставит стор. */
export type OrderDraft = Omit<Order, 'id' | 'number' | 'createdAt'>;
