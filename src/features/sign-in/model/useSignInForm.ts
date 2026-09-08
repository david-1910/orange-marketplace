import { useCallback, useState } from 'react';

import { useUserActions } from '@/entities/user';
import { notify } from '@/shared/lib';

import {
  PHONE_DIGITS,
  extractPhoneDigits,
  formatPhone,
  isPhoneComplete,
} from '../lib/phoneMask';

export interface SignInForm {
  /** Значение поля, всегда в виде маски. */
  phone: string;
  /** Введённых цифр после кода страны. */
  digitsCount: number;
  isComplete: boolean;
  error: string | null;
  setPhone: (raw: string) => void;
  /** Возвращает true, если вход состоялся. */
  submit: () => boolean;
  reset: () => void;
}

/**
 * Форма входа по номеру телефона.
 *
 * Ошибку показываем только после попытки отправки, а не по ходу
 * набора: иначе поле краснеет на первой же цифре, хотя человек просто
 * ещё не закончил.
 */
export const useSignInForm = (): SignInForm => {
  const { signIn } = useUserActions();

  const [phone, setPhoneValue] = useState(() => formatPhone(''));
  const [error, setError] = useState<string | null>(null);

  const isComplete = isPhoneComplete(phone);

  const setPhone = useCallback((raw: string) => {
    setPhoneValue(formatPhone(raw));
    setError(null);
  }, []);

  const submit = useCallback(() => {
    if (!isPhoneComplete(phone)) {
      setError(`Введите ${PHONE_DIGITS} цифр номера`);
      return false;
    }

    signIn(phone);
    notify.success('Вы вошли');

    return true;
  }, [phone, signIn]);

  return {
    phone,
    digitsCount: extractPhoneDigits(phone).length,
    isComplete,
    error,
    setPhone,
    submit,
    reset: useCallback(() => {
      setPhoneValue(formatPhone(''));
      setError(null);
    }, []),
  };
};
