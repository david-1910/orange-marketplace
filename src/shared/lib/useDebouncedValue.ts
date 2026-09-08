import { useEffect, useState } from 'react';

/**
 * Значение, отстающее от переданного на указанную задержку.
 *
 * Нужно полю поиска: без задержки запрос уходил бы на каждое нажатие
 * клавиши, и подсказки мигали бы результатами недонабранных слов.
 *
 * setState здесь стоит в колбэке таймера, а не в теле эффекта:
 * таймер — внешняя система, подписка на которую и есть законное
 * назначение эффекта.
 */
export const useDebouncedValue = <TValue>(
  value: TValue,
  delayMs = 300,
): TValue => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
};
