import { cn } from '@/shared/lib';

import { IconClose } from './icons/IconClose';

export type QuantityStepperSize = 'sm' | 'md';

export interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Подпись товара — уходит в aria-label кнопок. */
  itemLabel?: string;
  size?: QuantityStepperSize;
  className?: string;
}

const SIZES: Record<QuantityStepperSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-14 text-base',
};

const BUTTON_SIZES: Record<QuantityStepperSize, string> = {
  sm: 'size-9',
  md: 'size-14',
};

/**
 * Контрол «− N +». Домена не знает: получает число и два колбэка,
 * поэтому годится и карточке в сетке, и строке корзины.
 *
 * На единице «минус» превращается в крестик: следующее нажатие
 * удалит позицию, и об этом нужно предупредить до клика, а не после.
 */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  itemLabel,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const suffix = itemLabel ? ` — ${itemLabel}` : '';
  const willRemove = value <= 1;

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-full border border-gray-900/10 bg-white',
        SIZES[size],
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={
          willRemove ? `Убрать из корзины${suffix}` : `Меньше${suffix}`
        }
        className={cn(
          'grid shrink-0 place-items-center rounded-full transition-colors',
          BUTTON_SIZES[size],
          willRemove
            ? 'hover:text-error-600 text-gray-400'
            : 'hover:text-brand-600 text-gray-900',
        )}
      >
        {willRemove ? (
          <IconClose className="size-4" />
        ) : (
          // Минус рисуем полоской, а не текстом: у текстового «−»
          // своя метрика, и он не встаёт по центру кружка.
          <span aria-hidden className="h-0.5 w-3.5 rounded-full bg-current" />
        )}
      </button>

      <span
        aria-live="polite"
        className="text-price min-w-6 text-center text-gray-900 tabular-nums"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Больше${suffix}`}
        className={cn(
          'hover:text-brand-600 grid shrink-0 place-items-center rounded-full text-gray-900 transition-colors',
          BUTTON_SIZES[size],
        )}
      >
        <span aria-hidden className="relative grid place-items-center">
          <span className="h-0.5 w-3.5 rounded-full bg-current" />
          <span className="absolute h-3.5 w-0.5 rounded-full bg-current" />
        </span>
      </button>
    </div>
  );
}
