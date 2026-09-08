import type { DeliveryMethod, PaymentMethod } from '../model/types';

export interface DeliveryOption {
  method: DeliveryMethod;
  title: string;
  /** Приписка под названием: «от 5 000 сум». */
  hint: string;
  price: number;
  address: string;
}

/**
 * Способы получения и их цены.
 *
 * Лежат в config, а не в api: это правила магазина, а не ответ
 * сервера. Появится бэкенд — список приедет запросом, и тогда файл
 * переедет в api вместе с типом.
 */
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    method: 'pickup',
    title: 'Пункт выдачи',
    hint: 'Заказ хранится 8 дней',
    price: 5000,
    address:
      'г. Ташкент, Мирзо-Улугбекский район, массив Ялангач, улица Шахриабад, 2',
  },
  {
    method: 'courier',
    title: 'Курьером',
    hint: 'Доставка по Ташкенту за 2 часа',
    price: 30000,
    address: 'г. Ташкент, по указанному адресу',
  },
];

/**
 * С какой суммы заказа доставка бесплатна.
 *
 * Порог подобран под цены каталога: товары идут от 110 000 до
 * 35 000 000 сум, и при пороге в пять миллионов доставка выходила
 * бесплатной почти всегда — выбор способа получения перестал бы
 * влиять на сумму, а подсказка «ещё N сум до бесплатной» никогда
 * бы не показывалась.
 */
export const FREE_DELIVERY_FROM = 20_000_000;

export interface PaymentOption {
  method: PaymentMethod;
  title: string;
  hint: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { method: 'card', title: 'Картой онлайн', hint: 'UZCARD, HUMO, Visa' },
  {
    method: 'installment',
    title: 'Рассрочка без переплат',
    hint: 'Доставка и проценты включены',
  },
  {
    method: 'onDelivery',
    title: 'При получении',
    hint: 'Наличными или картой',
  },
];

/**
 * Цена доставки с учётом порога бесплатной.
 *
 * Считается здесь, а не в компоненте: порог нужен и сводке, и подсказке
 * «ещё N сум — и доставка бесплатно», и созданию заказа.
 */
export const calcDeliveryPrice = (
  method: DeliveryMethod,
  subtotal: number,
): number => {
  if (subtotal >= FREE_DELIVERY_FROM) return 0;

  return (
    DELIVERY_OPTIONS.find((option) => option.method === method)?.price ?? 0
  );
};

/** Сколько не хватает до бесплатной доставки; 0 — уже бесплатно. */
export const calcAmountToFreeDelivery = (subtotal: number): number =>
  Math.max(FREE_DELIVERY_FROM - subtotal, 0);
