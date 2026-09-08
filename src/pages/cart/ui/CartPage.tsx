import { useMemo } from 'react';

import { Link } from 'react-router';

import { calcCartTotals, useCartActions } from '@/entities/cart';
import { ROUTES } from '@/shared/config';
import {
  EmptyState,
  IconArrowUpRight,
  LogoMonogram,
  SplitText,
} from '@/shared/ui';
import { CartList, useCartRows } from '@/widgets/cart-list';
import { OrderSummary } from '@/widgets/order-summary';

import { useCartSelection } from '../model/useCartSelection';

/** «1 товар», «2 товара», «5 товаров». */
const pluralizeItems = (count: number): string => {
  const tail = count % 100;
  if (tail >= 11 && tail <= 14) return 'товаров';

  switch (count % 10) {
    case 1:
      return 'товар';
    case 2:
    case 3:
    case 4:
      return 'товара';
    default:
      return 'товаров';
  }
};

/**
 * Корзина. Страница компонует список и сводку и владеет только
 * выбором позиций.
 *
 * Оба виджета она соединяет сама: виджет не имеет права импортировать
 * другой виджет, композиция разных слоёв — работа страницы.
 *
 * Сводка считается по выбранным позициям, а не по всей корзине:
 * галочки затем и нужны, чтобы оформить часть заказа.
 */
export function CartPage() {
  const { rows, isLoading, isError, refetch } = useCartRows();
  const { removeMany } = useCartActions();

  const productIds = useMemo(() => rows.map((row) => row.productId), [rows]);
  const { selectedIds, setSelected, toggleAll } = useCartSelection(productIds);

  const selectedTotals = useMemo(
    () =>
      calcCartTotals(rows.filter((row) => selectedIds.includes(row.productId))),
    [rows, selectedIds],
  );

  const isEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-label text-gray-400 uppercase">03 — Корзина</span>
        <p aria-hidden className="text-display-sm text-gray-900 uppercase">
          <SplitText text="Ваша корзина" by="word" stagger={0.06} />
        </p>
        <h1 className="sr-only">Ваша корзина</h1>
        {!isEmpty && (
          <p className="text-ui text-gray-500 tabular-nums">
            {rows.length} {pluralizeItems(rows.length)}
          </p>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<LogoMonogram className="size-16" />}
          title="Корзина пуста"
          description="Выберите товары в каталоге — они появятся здесь."
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
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <CartList
              rows={rows}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              selectedIds={selectedIds}
              onSelectedChange={setSelected}
              onToggleAll={toggleAll}
              onRemoveSelected={() => removeMany(selectedIds)}
            />
          </div>

          <div className="lg:col-span-4">
            {/* Сводка прилипает: список длинный, а кнопка оформления
                должна оставаться на экране. */}
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                totals={selectedTotals}
                action={
                  <Link
                    to={ROUTES.checkout}
                    aria-disabled={selectedIds.length === 0}
                    className="text-label hover:bg-brand-500 flex h-14 items-center justify-center rounded-full bg-gray-900 text-white uppercase transition-colors aria-disabled:pointer-events-none aria-disabled:bg-gray-100 aria-disabled:text-gray-400"
                  >
                    Перейти к оформлению
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
