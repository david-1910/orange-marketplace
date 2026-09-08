import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router';

import { useCartActions } from '@/entities/cart';
import {
  DELIVERY_OPTIONS,
  type DeliveryMethod,
  type OrderItem,
  type PaymentMethod,
  calcDeliveryPrice,
  useOrderActions,
} from '@/entities/order';
import { useUser } from '@/entities/user';
import { ROUTES, buildPath } from '@/shared/config';
import { notify } from '@/shared/lib';

export interface CheckoutTotals {
  fullPrice: number;
  discount: number;
  subtotal: number;
}

export interface CheckoutOrderInput {
  /** Позиции, которые оформляем: снимки товаров на момент покупки. */
  items: OrderItem[];
  totals: CheckoutTotals;
  promoDiscount: number;
  promoCode?: string;
}

export interface CheckoutOrder {
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  /** Цена доставки для выбранного способа и текущей суммы. */
  deliveryPrice: number;
  /** Итого к оплате: товары − скидки − промокод + доставка. */
  total: number;
  isSubmitting: boolean;
  /**
   * Заказ создан, переход на его страницу запущен.
   *
   * Нужен странице оформления: она уводит в корзину, когда оформлять
   * нечего, и без этого признака её редирект срабатывает сразу после
   * оплаты — корзина к тому моменту уже пуста. Одного isSubmitting
   * мало: react-router применяет навигацию как transition, а
   * обновление стора корзины срочное, поэтому срочный рендер
   * успевает пройти раньше смены роута.
   */
  isFinished: boolean;
  /** Оформить и оплатить. Гость получит false — сначала вход. */
  submit: () => void;
  canSubmit: boolean;
}

/** Сколько «думает» имитация оплаты. */
const PAYMENT_LATENCY = 900;

/**
 * Оформление заказа: выбор доставки и оплаты, создание заказа.
 *
 * Фича сознательно знает о трёх сущностях — корзине, пользователе и
 * заказе. Это не нарушение изоляции: сущности друг о друге по-прежнему
 * ничего не знают, а склейка живёт слоем выше, где ей и место.
 *
 * Позиции приходят снаружи готовыми снимками: собрать их может только
 * тот, у кого есть и корзина, и каталог, — страница.
 */
export const useCheckoutOrder = ({
  items,
  totals,
  promoDiscount,
  promoCode,
}: CheckoutOrderInput): CheckoutOrder => {
  const navigate = useNavigate();
  const user = useUser();
  const { create } = useOrderActions();
  const { removeMany } = useCartActions();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [status, setStatus] = useState<'idle' | 'paying' | 'finished'>('idle');

  const isSubmitting = status === 'paying';

  const deliveryPrice = calcDeliveryPrice(deliveryMethod, totals.subtotal);
  const total = totals.subtotal - promoDiscount + deliveryPrice;

  const canSubmit = Boolean(user) && items.length > 0 && !isSubmitting;

  const submit = useCallback(() => {
    if (!user || items.length === 0 || isSubmitting) return;

    const option = DELIVERY_OPTIONS.find(
      (candidate) => candidate.method === deliveryMethod,
    );

    setStatus('paying');

    // Имитация оплаты: без задержки переход выглядит так, будто
    // кнопка не сработала.
    window.setTimeout(() => {
      const order = create({
        items,
        fullPrice: totals.fullPrice,
        discount: totals.discount,
        promoDiscount,
        ...(promoCode ? { promoCode } : {}),
        delivery: {
          method: deliveryMethod,
          address: option?.address ?? '',
          price: deliveryPrice,
        },
        payment: paymentMethod,
        recipient: { name: user.name, phone: user.phone },
        total,
      });

      notify.success(`Заказ № ${order.number} оплачен`);

      // Переход раньше очистки корзины — это важно, а не вкусовое.
      // Страница оформления сама уводит в корзину, когда оформлять
      // нечего; вычисти корзину до навигации — и этот её редирект
      // сработает первым, увезя человека в пустую корзину вместо
      // только что оплаченного заказа.
      void navigate(buildPath(ROUTES.order, { id: order.id }));

      // Из корзины уходят только оформленные позиции: остальные
      // человек оставил на потом осознанно.
      removeMany(items.map((item) => item.productId));

      // В idle не возвращаемся: заказ уже создан, и повторная оплата
      // той же корзины создала бы его дубль.
      setStatus('finished');
    }, PAYMENT_LATENCY);
  }, [
    user,
    items,
    isSubmitting,
    deliveryMethod,
    deliveryPrice,
    paymentMethod,
    promoCode,
    promoDiscount,
    totals,
    total,
    create,
    removeMany,
    navigate,
  ]);

  return {
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    deliveryPrice,
    total,
    isSubmitting,
    isFinished: status === 'finished',
    submit,
    canSubmit,
  };
};
