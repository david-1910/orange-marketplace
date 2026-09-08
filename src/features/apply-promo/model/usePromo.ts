import { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { notify } from '@/shared/lib';

import { findPromoRequest, type Promo } from '../api/promo-api';

export interface AppliedPromo {
  code: string;
  discount: number;
}

export interface PromoState {
  /** Применённый промокод или null. */
  applied: AppliedPromo | null;
  isChecking: boolean;
  error: string | null;
  apply: (code: string) => void;
  reset: () => void;
}

/** Скидка по промокоду с учётом её потолка. */
const calcPromoDiscount = (promo: Promo, subtotal: number): number =>
  Math.min(Math.round((subtotal * promo.percent) / 100), promo.maxDiscount);

/**
 * Проверка и применение промокода.
 *
 * Проверка идёт через useMutation, а не useQuery: это действие по
 * нажатию кнопки, а не данные, которые нужно держать свежими. При
 * появлении бэкенда меняется только запрос в api.
 *
 * Скидка считается от переданной суммы товаров, поэтому хук не знает
 * ни про корзину, ни про доставку — их подставляет страница.
 */
export const usePromo = (subtotal: number): PromoState => {
  const [applied, setApplied] = useState<AppliedPromo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: findPromoRequest,
    onSuccess: (promo) => {
      if (!promo) {
        setApplied(null);
        setError('Такого промокода нет');
        notify.error('Такого промокода нет');
        return;
      }

      const discount = calcPromoDiscount(promo, subtotal);

      setError(null);
      setApplied({ code: promo.code, discount });
      notify.success(`Промокод ${promo.code} применён`);
    },
    onError: () => setError('Не удалось проверить промокод'),
  });

  const apply = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setError('Введите промокод');
        return;
      }

      setError(null);
      mutate(code);
    },
    [mutate],
  );

  return {
    applied,
    isChecking: isPending,
    error,
    apply,
    reset: useCallback(() => {
      setApplied(null);
      setError(null);
    }, []),
  };
};
