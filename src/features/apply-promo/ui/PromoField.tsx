import { useState } from 'react';

import { formatPrice } from '@/entities/product';
import { Input } from '@/shared/ui';

import type { PromoState } from '../model/usePromo';

export interface PromoFieldProps {
  promo: PromoState;
  className?: string;
}

/**
 * Поле промокода.
 *
 * Состояние применённого кода живёт в usePromo у страницы: скидка
 * нужна и сводке, и создаваемому заказу, поэтому поле её не хранит, а
 * получает готовой.
 */
export function PromoField({ promo, className }: PromoFieldProps) {
  const [code, setCode] = useState('');

  const { applied, isChecking, error, apply, reset } = promo;

  if (applied) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-900/5 bg-white p-4">
          <div className="flex flex-col gap-1">
            <span className="text-label text-gray-400 uppercase">
              Промокод {applied.code}
            </span>
            <span className="text-price text-brand-600 tabular-nums">
              − {formatPrice(applied.discount)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              setCode('');
            }}
            className="text-ui hover:text-error-600 text-gray-500 transition-colors"
          >
            Убрать
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        apply(code);
      }}
      className={className}
    >
      <div className="flex items-start gap-2 rounded-2xl border border-gray-900/5 bg-white p-4">
        <Input
          label="Промокод"
          value={code}
          placeholder="ORANGE20"
          autoComplete="off"
          // Промокоды набраны капсом, поэтому и поле показывает капс:
          // нормализацию всё равно делает запрос.
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          {...(error ? { error } : {})}
        />

        <button
          type="submit"
          aria-disabled={isChecking}
          className="text-label hover:border-brand-500 hover:text-brand-600 mt-7 h-10 shrink-0 rounded-full border border-gray-900/10 px-4 text-gray-900 uppercase transition-colors aria-disabled:opacity-50"
        >
          {isChecking ? '…' : 'Применить'}
        </button>
      </div>
    </form>
  );
}
