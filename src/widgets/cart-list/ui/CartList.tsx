import { AnimatePresence, motion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { Checkbox, ErrorState, Skeleton } from '@/shared/ui';

import type { CartRow } from '../model/useCartRows';

import { CartRowItem } from './CartRowItem';

export interface CartListProps {
  rows: CartRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  /** Идентификаторы выбранных позиций. */
  selectedIds: string[];
  onSelectedChange: (productId: string, isSelected: boolean) => void;
  /** Снять или поставить галочки на всех позициях сразу. */
  onToggleAll: (isSelected: boolean) => void;
  onRemoveSelected: () => void;
}

/**
 * Список позиций корзины с управлением выбором.
 *
 * Данные и выбор приходят пропсами: список ничего не хранит, поэтому
 * его можно показать и на странице корзины, и в любом другом месте,
 * где нужен тот же вид.
 */
export function CartList({
  rows,
  isLoading,
  isError,
  onRetry,
  selectedIds,
  onSelectedChange,
  onToggleAll,
  onRemoveSelected,
}: CartListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  const isAllSelected = selectedIds.length === rows.length;
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="rounded-2xl border border-gray-900/5 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4 pb-4">
        <Checkbox
          checked={isAllSelected}
          // Частичный выбор показываем отдельным состоянием: иначе
          // галочка «снять все» выглядит как «ничего не выбрано»,
          // хотя часть позиций отмечена.
          isIndeterminate={hasSelection && !isAllSelected}
          onChange={(event) => onToggleAll(event.target.checked)}
          label={isAllSelected ? 'Снять все' : 'Выбрать все'}
        />

        <button
          type="button"
          onClick={onRemoveSelected}
          disabled={!hasSelection}
          className="text-ui hover:text-error-600 text-gray-500 transition-colors disabled:pointer-events-none disabled:opacity-40"
        >
          Удалить выбранные
        </button>
      </div>

      <ul className="flex flex-col">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.div
              key={row.productId}
              layout
              exit={{ opacity: 0, height: 0 }}
              transition={MOTION_TRANSITION.micro}
            >
              <CartRowItem
                row={row}
                isSelected={selectedIds.includes(row.productId)}
                onSelectedChange={(isSelected) =>
                  onSelectedChange(row.productId, isSelected)
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
