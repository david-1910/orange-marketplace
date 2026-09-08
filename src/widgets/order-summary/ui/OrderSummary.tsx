import type { ReactNode } from 'react';

import type { CartTotals } from '@/entities/cart';
import { formatPrice } from '@/entities/product';
import { cn } from '@/shared/lib';

export interface OrderSummaryProps {
  totals: CartTotals;
  /** Цена доставки. Не передана — строка не показывается. */
  deliveryPrice?: number;
  /** Скидка по промокоду, отдельно от товарных скидок. */
  promoDiscount?: number;
  /** Кнопка действия: «Перейти к оформлению» или «Оплатить». */
  action?: ReactNode;
  /** Приписка под кнопкой — например про обработку данных. */
  note?: ReactNode;
  className?: string;
}

interface SummaryLine {
  label: string;
  value: string;
  tone?: 'muted' | 'discount';
}

const TONES = {
  muted: 'text-gray-500',
  discount: 'text-brand-600',
} as const;

/**
 * Сводка «Ваш заказ»: состав суммы и кнопка действия.
 *
 * Один виджет и для корзины, и для оформления: строки различаются
 * только наличием доставки и промокода, а это входные данные, а не
 * повод для второго компонента.
 *
 * Суммы приходят готовыми: считает их calcCartTotals в сущности
 * корзины, чтобы арифметика жила в одном месте.
 */
export function OrderSummary({
  totals,
  deliveryPrice,
  promoDiscount = 0,
  action,
  note,
  className,
}: OrderSummaryProps) {
  const total = totals.subtotal + (deliveryPrice ?? 0) - promoDiscount;

  const lines: SummaryLine[] = [
    {
      label: `${totals.count} ${totals.count === 1 ? 'товар' : 'товара'}`,
      value: formatPrice(totals.fullPrice),
    },
    ...(totals.discount > 0
      ? [
          {
            label: 'Скидки',
            value: `− ${formatPrice(totals.discount)}`,
            tone: 'discount' as const,
          },
        ]
      : []),
    ...(promoDiscount > 0
      ? [
          {
            label: 'Промокод',
            value: `− ${formatPrice(promoDiscount)}`,
            tone: 'discount' as const,
          },
        ]
      : []),
    ...(deliveryPrice === undefined
      ? []
      : [
          {
            label: 'Доставка',
            value: deliveryPrice ? formatPrice(deliveryPrice) : 'Бесплатно',
            tone: 'muted' as const,
          },
        ]),
  ];

  return (
    <section
      aria-label="Ваш заказ"
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-gray-900/5 bg-white p-6',
        className,
      )}
    >
      <h2 className="text-total text-gray-900">Ваш заказ</h2>

      <dl className="flex flex-col gap-2">
        {lines.map((line) => (
          <div key={line.label} className="flex justify-between gap-4">
            <dt className="text-ui text-gray-500">{line.label}</dt>
            <dd
              className={cn(
                'text-ui tabular-nums',
                line.tone ? TONES[line.tone] : 'text-gray-900',
              )}
            >
              {line.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-gray-900/10 pt-4">
        <span className="text-label shrink-0 text-gray-400 uppercase">
          К оплате
        </span>
        {/* whitespace-nowrap обязателен: без него сумма рвётся между
            числом и «сум» и уезжает на подпись слева. */}
        <span className="text-total whitespace-nowrap text-gray-900 tabular-nums">
          {formatPrice(total)}
        </span>
      </div>

      {action}

      {note && <p className="text-label text-gray-400">{note}</p>}
    </section>
  );
}
