import { useMemo } from 'react';

import { Link, Navigate } from 'react-router';

import {
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  calcAmountToFreeDelivery,
} from '@/entities/order';
import { formatPrice } from '@/entities/product';
import { useUser } from '@/entities/user';
import { PromoField, usePromo } from '@/features/apply-promo';
import { useCheckoutOrder } from '@/features/checkout-order';
import { SignInButton } from '@/features/sign-in';
import { ROUTES } from '@/shared/config';
import { IconUser, Skeleton, SplitText } from '@/shared/ui';
import { useCartRows } from '@/widgets/cart-list';
import { OrderSummary } from '@/widgets/order-summary';

import { OptionCard } from './OptionCard';

/**
 * Оформление заказа.
 *
 * Страница собирает четыре независимых части: способ получения,
 * получателя, способ оплаты и промокод — и передаёт итог фиче
 * оформления. Своей бизнес-логики у неё нет, кроме превращения строк
 * корзины в снимки позиций заказа: сделать это может только тот, у
 * кого на руках и корзина, и каталог.
 *
 * Позиции берутся из useCartRows — того же хука, что и на странице
 * корзины, поэтому суммы в корзине и в чеке считаются одним кодом и
 * не могут разойтись.
 */
export function CheckoutPage() {
  const user = useUser();
  const { rows, totals, isLoading } = useCartRows();

  const promo = usePromo(totals.subtotal);

  // Снимок позиций: цена и название фиксируются на момент покупки,
  // чтобы чек не поехал за каталогом.
  const items = useMemo(
    () =>
      rows.map((row) => ({
        productId: row.productId,
        title: row.product.title,
        photoId: row.product.photoId,
        price: row.price,
        ...(row.oldPrice ? { oldPrice: row.oldPrice } : {}),
        quantity: row.quantity,
      })),
    [rows],
  );

  const promoDiscount = promo.applied?.discount ?? 0;

  const checkout = useCheckoutOrder({
    items,
    totals,
    promoDiscount,
    ...(promo.applied ? { promoCode: promo.applied.code } : {}),
  });

  const amountToFree = calcAmountToFreeDelivery(totals.subtotal);

  if (isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-[110rem] gap-6 px-4 pt-28 pb-20 sm:px-8 lg:grid-cols-12">
        <Skeleton className="h-96 lg:col-span-7" />
        <Skeleton className="h-64 lg:col-span-5" />
      </div>
    );
  }

  // Оформлять нечего — возвращаем в корзину, а не показываем пустой
  // чек с нулями. Но не во время оплаты: там корзина пустеет штатно,
  // и редирект перебил бы переход на страницу заказа.
  if (rows.length === 0 && !checkout.isSubmitting && !checkout.isFinished) {
    return <Navigate to={ROUTES.cart} replace />;
  }

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-label text-gray-400 uppercase">
          04 — Оформление
        </span>
        <p aria-hidden className="text-display-sm text-gray-900 uppercase">
          <SplitText text="Заказ" by="word" stagger={0.06} />
        </p>
        <h1 className="sr-only">Оформление заказа</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <section className="flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-6">
            <h2 className="text-total text-gray-900">Способ получения</h2>

            <div className="flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((option) => (
                <OptionCard
                  key={option.method}
                  name="delivery"
                  value={option.method}
                  isSelected={checkout.deliveryMethod === option.method}
                  onSelect={() => checkout.setDeliveryMethod(option.method)}
                  title={option.title}
                  hint={option.hint}
                  meta={
                    checkout.deliveryMethod === option.method &&
                    checkout.deliveryPrice === 0
                      ? 'Бесплатно'
                      : formatPrice(option.price)
                  }
                />
              ))}
            </div>

            <p className="text-ui text-gray-500">
              {
                DELIVERY_OPTIONS.find(
                  (option) => option.method === checkout.deliveryMethod,
                )?.address
              }
            </p>

            {amountToFree > 0 && (
              <p className="text-label text-brand-600">
                Ещё {formatPrice(amountToFree)} — и доставка бесплатно
              </p>
            )}
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-6">
            <h2 className="text-total text-gray-900">Получатель</h2>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="bg-brand-50 text-brand-600 grid size-11 shrink-0 place-items-center rounded-full">
                  <IconUser className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-ui font-medium text-gray-900">
                    {user.name}
                  </span>
                  <span className="text-ui text-gray-400 tabular-nums">
                    {user.phone}
                  </span>
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <p className="text-ui text-gray-500">
                  Войдите по номеру телефона — по нему сохранится заказ.
                </p>
                <SignInButton>Войти</SignInButton>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-6">
            <h2 className="text-total text-gray-900">Способ оплаты</h2>

            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((option) => (
                <OptionCard
                  key={option.method}
                  name="payment"
                  value={option.method}
                  isSelected={checkout.paymentMethod === option.method}
                  onSelect={() => checkout.setPaymentMethod(option.method)}
                  title={option.title}
                  hint={option.hint}
                />
              ))}
            </div>
          </section>

          <PromoField promo={promo} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <OrderSummary
              totals={totals}
              deliveryPrice={checkout.deliveryPrice}
              promoDiscount={promoDiscount}
              action={
                <button
                  type="button"
                  onClick={checkout.submit}
                  aria-disabled={!checkout.canSubmit}
                  className="text-label hover:bg-brand-500 flex h-14 items-center justify-center rounded-full bg-gray-900 text-white uppercase transition-colors aria-disabled:bg-gray-100 aria-disabled:text-gray-400"
                >
                  {checkout.isSubmitting ? 'Оплачиваем…' : 'Оплатить'}
                </button>
              }
              note={
                user ? (
                  'Размещая заказ, вы соглашаетесь на обработку персональных данных.'
                ) : (
                  <span className="text-brand-600">
                    Войдите, чтобы оформить заказ
                  </span>
                )
              }
            />

            <Link
              to={ROUTES.cart}
              className="text-ui hover:text-brand-600 mt-4 inline-block text-gray-500 transition-colors"
            >
              ← Вернуться в корзину
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
