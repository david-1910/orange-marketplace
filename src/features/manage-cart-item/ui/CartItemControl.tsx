import { AnimatePresence, motion } from 'motion/react';

import type { Product } from '@/entities/product';
import { MOTION_TRANSITION } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ClickSpark, QuantityStepper } from '@/shared/ui';

import { useCartItemControl } from '../model/useCartItemControl';

export type CartItemControlSize = 'sm' | 'md';

export interface CartItemControlProps {
  product: Product;
  /** sm — для карточки в сетке и строки корзины, md — для страницы товара. */
  size?: CartItemControlSize;
  className?: string;
}

const HEIGHTS: Record<CartItemControlSize, string> = {
  sm: 'h-9',
  md: 'h-14',
};

/**
 * Кнопка «В корзину», которая после нажатия становится счётчиком.
 *
 * Оба вида живут в одном компоненте и меняются через AnimatePresence
 * mode="wait": сначала уходит прежний, потом появляется новый, — так
 * подмена читается как превращение, а не как подмена блока.
 *
 * Компонент только рисует: количество и действия приходят из
 * useCartItemControl.
 */
export function CartItemControl({
  product,
  size = 'md',
  className,
}: CartItemControlProps) {
  const { quantity, isUnavailable, label, add, increment, decrement } =
    useCartItemControl(product);

  const isInCart = quantity > 0;

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isInCart ? 'stepper' : 'button'}
          // Степпер не просто проявляется, а «выщёлкивается»: момент
          // попадания товара в корзину должен быть виден под пальцем,
          // а не только в счётчике шапки. Кнопка возвращается ровнее —
          // удаление праздновать нечем.
          initial={
            isInCart ? { y: 10, opacity: 0, scale: 0.9 } : { y: 10, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={isInCart ? MOTION_TRANSITION.ui : MOTION_TRANSITION.micro}
        >
          {isInCart ? (
            <QuantityStepper
              value={quantity}
              onIncrement={increment}
              onDecrement={decrement}
              itemLabel={product.title}
              size={size}
            />
          ) : (
            <ClickSpark count={10} className="w-full">
              <button
                type="button"
                // aria-disabled вместо disabled: отключённая кнопка
                // не получает события мыши и выпадает из обхода по
                // Tab, поэтому скринридер не может сообщить, почему
                // покупка недоступна.
                aria-disabled={isUnavailable}
                onClick={add}
                className={cn(
                  'text-label flex w-full items-center justify-center gap-2 rounded-full uppercase transition-colors',
                  HEIGHTS[size],
                  isUnavailable
                    ? 'bg-gray-100 text-gray-400'
                    : 'hover:bg-brand-500 bg-gray-900 text-white',
                )}
              >
                {label}
              </button>
            </ClickSpark>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
