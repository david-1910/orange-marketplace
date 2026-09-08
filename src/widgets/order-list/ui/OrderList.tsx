import { Link } from 'react-router';

import {
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
  getOrderStatus,
} from '@/entities/order';
import { buildProductImage, formatPrice } from '@/entities/product';
import { ROUTES, buildPath } from '@/shared/config';
import { Badge, type BadgeTone, IconArrowUpRight } from '@/shared/ui';

export interface OrderListProps {
  orders: Order[];
}

/** Сколько миниатюр показываем, прежде чем свернуть остальные в «+N». */
const VISIBLE_THUMBS = 4;

const STATUS_TONES: Record<OrderStatus, BadgeTone> = {
  assembling: 'warning',
  delivering: 'info',
  delivered: 'success',
};

/** «11 сентября» — год не нужен, пока заказ свежий. */
const formatDate = (createdAt: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(createdAt));

/**
 * История заказов карточками.
 *
 * Статус каждого заказа считается на месте из его createdAt — тем же
 * `getOrderStatus`, что и на странице заказа, поэтому список и
 * страница не могут показать разное. Таймера здесь нет намеренно:
 * в списке важен факт стадии, а не секунда её смены, и заводить по
 * таймеру на каждую карточку ради надписи не стоит.
 */
export function OrderList({ orders }: OrderListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => {
        const status = getOrderStatus(order.createdAt);
        const hiddenCount = order.items.length - VISIBLE_THUMBS;

        return (
          <li key={order.id}>
            <Link
              to={buildPath(ROUTES.order, { id: order.id })}
              className="hover:border-brand-300 hover:shadow-soft flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-5 transition-all sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-label text-gray-400 uppercase">
                    № {order.number}
                  </span>
                  <Badge tone={STATUS_TONES[status]}>
                    {ORDER_STATUS_LABELS[status]}
                  </Badge>
                  <span className="text-label text-gray-400">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {order.items.slice(0, VISIBLE_THUMBS).map((item) => (
                    <span
                      key={item.productId}
                      className="bg-brand-50 size-12 overflow-hidden rounded-lg"
                    >
                      <img
                        src={buildProductImage(item.photoId, 96)}
                        alt={item.title}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </span>
                  ))}

                  {hiddenCount > 0 && (
                    <span className="text-label grid size-12 place-items-center rounded-lg bg-gray-100 text-gray-500 tabular-nums">
                      +{hiddenCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="text-total whitespace-nowrap text-gray-900 tabular-nums">
                  {formatPrice(order.total)}
                </span>
                <span className="text-label text-brand-600 flex items-center gap-1 uppercase">
                  Подробнее
                  <IconArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
