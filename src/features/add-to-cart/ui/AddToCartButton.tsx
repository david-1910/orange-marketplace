import { AnimatePresence, motion } from 'motion/react';

import type { Product } from '@/entities/product';
import { MOTION_TRANSITION, cursorLabel } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ClickSpark, IconCheck } from '@/shared/ui';

import { type CartState, useAddToCart } from '../model/useAddToCart';

export type AddToCartSize = 'sm' | 'md';

export interface AddToCartButtonProps {
  product: Product;
  /** sm — для карточки в сетке, md — для страницы товара. */
  size?: AddToCartSize;
  className?: string;
}

const SIZES: Record<AddToCartSize, string> = {
  sm: 'h-10',
  md: 'h-14',
};

const STATE_CLASSES: Record<CartState, string> = {
  unavailable: 'bg-gray-100 text-gray-400',
  added: 'bg-success-500 text-white',
  idle: 'hover:bg-brand-500 bg-gray-900 text-white',
};

/**
 * Кнопка «В корзину» с морфингом текста в «Добавлено».
 *
 * Компонент только рисует: состояние, подпись и действие приходят
 * из useAddToCart. Здесь остались лишь классы под состояние — это
 * оформление, а не логика.
 */
export function AddToCartButton({
  product,
  size = 'md',
  className,
}: AddToCartButtonProps) {
  const { state, label, isUnavailable, add } = useAddToCart(product);

  return (
    <ClickSpark count={10} className={cn('w-full', className)}>
      <button
        type="button"
        // aria-disabled вместо disabled: отключённая кнопка не
        // получает события мыши и выпадает из обхода по Tab,
        // поэтому ни курсор, ни скринридер не могут сообщить,
        // почему покупка недоступна.
        aria-disabled={isUnavailable}
        onClick={add}
        {...cursorLabel(label)}
        className={cn(
          'text-label flex w-full items-center justify-center gap-2 rounded-full uppercase transition-colors',
          SIZES[size],
          STATE_CLASSES[state],
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={MOTION_TRANSITION.micro}
            className="flex items-center gap-2"
          >
            {state === 'added' && <IconCheck className="size-4" />}
            {label}
          </motion.span>
        </AnimatePresence>
      </button>
    </ClickSpark>
  );
}
