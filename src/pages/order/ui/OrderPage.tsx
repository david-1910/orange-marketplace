import { Link, useParams } from 'react-router';

import {
  DELIVERY_OPTIONS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_SEQUENCE,
  useOrder,
} from '@/entities/order';
import { buildProductImage, formatPrice } from '@/entities/product';
import { useUser } from '@/entities/user';
import { ROUTES, buildPath } from '@/shared/config';
import { cn } from '@/shared/lib';
import {
  Badge,
  EmptyState,
  IconArrowUpRight,
  IconCheck,
  LogoMonogram,
  SplitText,
} from '@/shared/ui';

import { useOrderStatus } from '../model/useOrderStatus';

/** «11 сентября, 14:32» — дата в том виде, в котором её читают. */
const formatCreatedAt = (createdAt: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt));

/**
 * Заказ и его статус.
 *
 * Статус приходит из useOrderStatus: он выводится из времени создания
 * и сам обновляется, когда наступает следующая стадия.
 */
export function OrderPage() {
  const { id } = useParams<'id'>();
  const found = useOrder(id);
  const user = useUser();

  /**
   * Заказ показывается только тому, на чей номер он оформлен.
   *
   * Ссылка на заказ угадываема не больше, чем uuid, но заказы лежат в
   * localStorage браузера: без этой проверки человек, вошедший под
   * другим номером, открыл бы чужой чек с адресом и телефоном по
   * прямой ссылке из истории браузера.
   */
  const order =
    found && user && found.recipient.phone === user.phone ? found : null;

  // Хук вызывается всегда, даже когда заказа нет: правила хуков не
  // позволяют условный вызов. Пустая строка даст «Доставлен», но это
  // значение не используется — ниже стоит ранний выход.
  const status = useOrderStatus(order?.createdAt ?? '');

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-32 pb-20">
        <EmptyState
          icon={<LogoMonogram className="size-16" />}
          title="Заказ не найден"
          description="Возможно, ссылка устарела, заказ оформлен в другом браузере или на другой номер."
          action={
            <Link
              to={ROUTES.catalog}
              className="text-label hover:border-brand-500 hover:text-brand-600 flex items-center gap-2 rounded-full border border-gray-900/10 px-5 py-3 text-gray-900 uppercase transition-colors"
            >
              В каталог
              <IconArrowUpRight className="size-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const currentStep = ORDER_STATUS_SEQUENCE.indexOf(status);
  const deliveryTitle = DELIVERY_OPTIONS.find(
    (option) => option.method === order.delivery.method,
  )?.title;

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-label text-gray-400 uppercase">
          Заказ № {order.number}
        </span>
        <p aria-hidden className="text-display-sm text-gray-900 uppercase">
          <SplitText
            text={ORDER_STATUS_LABELS[status]}
            by="word"
            stagger={0.06}
          />
        </p>
        <h1 className="sr-only">
          Заказ № {order.number} — {ORDER_STATUS_LABELS[status]}
        </h1>
        <p className="text-ui text-gray-500">
          Оформлен {formatCreatedAt(order.createdAt)}
        </p>
      </div>

      {/* Полоса стадий: пройденные закрашены, текущая подсвечена. */}
      <ol className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-2">
        {ORDER_STATUS_SEQUENCE.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step} className="flex flex-1 items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full border transition-colors',
                  isDone && 'border-success-500 bg-success-500 text-white',
                  isCurrent && 'border-brand-500 bg-brand-500 text-white',
                  !isDone && !isCurrent && 'border-gray-900/10 text-gray-300',
                )}
              >
                {isDone ? (
                  <IconCheck className="size-4" />
                ) : (
                  <span className="text-label tabular-nums">{index + 1}</span>
                )}
              </span>

              <span
                className={cn(
                  'text-label uppercase',
                  isCurrent ? 'text-gray-900' : 'text-gray-400',
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>

              {index < ORDER_STATUS_SEQUENCE.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-px flex-1 bg-gray-900/10 sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-6 lg:col-span-7">
          <h2 className="text-total text-gray-900">Состав заказа</h2>

          <ul className="flex flex-col">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-4 border-t border-gray-900/5 py-4 first:border-t-0 first:pt-0"
              >
                <Link
                  to={buildPath(ROUTES.product, { id: item.productId })}
                  className="bg-brand-50 size-16 shrink-0 overflow-hidden rounded-xl"
                >
                  <img
                    src={buildProductImage(item.photoId, 128)}
                    alt={item.title}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-ui line-clamp-2 font-medium text-gray-900">
                    {item.title}
                  </span>
                  <span className="text-label text-gray-400 tabular-nums">
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>

                <span className="text-price shrink-0 text-gray-900 tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className="flex flex-col gap-3 rounded-2xl border border-gray-900/5 bg-white p-6">
            <h2 className="text-total text-gray-900">Доставка</h2>

            <div className="flex items-center gap-2">
              <Badge tone="neutral">{deliveryTitle}</Badge>
              {order.delivery.price === 0 && (
                <Badge tone="success">Бесплатно</Badge>
              )}
            </div>

            <p className="text-ui text-gray-500">{order.delivery.address}</p>

            <div className="flex flex-col gap-1 border-t border-gray-900/10 pt-3">
              <span className="text-label text-gray-400 uppercase">
                Получатель
              </span>
              <span className="text-ui text-gray-900">
                {order.recipient.name}
              </span>
              <span className="text-ui text-gray-400 tabular-nums">
                {order.recipient.phone}
              </span>
            </div>
          </section>

          <section className="flex flex-col gap-2 rounded-2xl border border-gray-900/5 bg-white p-6">
            <h2 className="text-total mb-2 text-gray-900">Оплата</h2>

            <div className="flex justify-between gap-4">
              <span className="text-ui text-gray-500">Товары</span>
              <span className="text-ui text-gray-900 tabular-nums">
                {formatPrice(order.fullPrice)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-ui text-gray-500">Скидки</span>
                <span className="text-ui text-brand-600 tabular-nums">
                  − {formatPrice(order.discount)}
                </span>
              </div>
            )}

            {order.promoDiscount > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-ui text-gray-500">
                  Промокод {order.promoCode}
                </span>
                <span className="text-ui text-brand-600 tabular-nums">
                  − {formatPrice(order.promoDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between gap-4">
              <span className="text-ui text-gray-500">Доставка</span>
              <span className="text-ui text-gray-900 tabular-nums">
                {order.delivery.price
                  ? formatPrice(order.delivery.price)
                  : 'Бесплатно'}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-gray-900/10 pt-3">
              <span className="text-label shrink-0 text-gray-400 uppercase">
                Оплачено
              </span>
              <span className="text-total whitespace-nowrap text-gray-900 tabular-nums">
                {formatPrice(order.total)}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
