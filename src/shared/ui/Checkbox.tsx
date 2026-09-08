import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconCheck } from './icons/IconCheck';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  label?: ReactNode;
  /**
   * Часть выбрана, часть нет — состояние «выбрать все» над списком.
   * Ставится и визуально, и в `indeterminate` у самого input, иначе
   * скринридер сообщит просто «не отмечено».
   */
  isIndeterminate?: boolean;
  /** Скрыть подпись визуально, оставив её для скринридера. */
  isLabelHidden?: boolean;
}

/**
 * Чекбокс на настоящем `<input type="checkbox">`.
 *
 * Нативный элемент оставлен и спрятан через `peer` + `sr-only`, а не
 * заменён на div с role: так бесплатно работают клавиатура, форма,
 * состояние `:focus-visible` и `indeterminate`.
 */
export function Checkbox({
  label,
  isIndeterminate = false,
  isLabelHidden = false,
  className,
  id,
  checked,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isMarked = Boolean(checked) || isIndeterminate;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        // Свойство indeterminate ставится только из JS: атрибута для
        // него в HTML нет.
        ref={(node) => {
          if (node) node.indeterminate = isIndeterminate;
        }}
        className="peer sr-only"
        {...rest}
      />

      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2"
      >
        <span
          aria-hidden
          className={cn(
            'peer-focus-visible:ring-brand-200 grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2',
            isMarked
              ? 'border-brand-500 bg-brand-500 text-white'
              : 'hover:border-brand-400 border-gray-900/20 bg-white',
          )}
        >
          {isIndeterminate ? (
            <span className="h-0.5 w-2.5 rounded-full bg-current" />
          ) : (
            checked && <IconCheck className="size-3.5" />
          )}
        </span>

        {label && (
          <span
            className={cn('text-ui text-gray-900', isLabelHidden && 'sr-only')}
          >
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
