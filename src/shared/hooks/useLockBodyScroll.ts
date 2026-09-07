import { useEffect } from 'react';

/**
 * Запрещает прокрутку документа, пока компонент смонтирован.
 *
 * Нужно любому оверлею: под ним остаётся живая страница, и без
 * блокировки на экране два скроллбара сразу — документа и самого
 * оверлея.
 *
 * Ширина исчезнувшего скроллбара компенсируется отступом, иначе
 * контент под оверлеем дёргается вправо в момент открытия.
 */
export const useLockBodyScroll = (isLocked = true): void => {
  useEffect(() => {
    if (!isLocked) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked]);
};
