import { useEffect, useState } from 'react';

const QUERY = '(pointer: fine)';

/**
 * Есть ли у пользователя точный указатель (мышь, трекпад, стилус).
 * Магниты, наклоны за курсором и кастомный курсор обязаны быть
 * инертны на тач-устройствах — там курсора просто нет.
 */
export const usePointerFine = (): boolean => {
  const [isPointerFine, setIsPointerFine] = useState(
    () => window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsPointerFine(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isPointerFine;
};
