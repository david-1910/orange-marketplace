import { useCallback, useEffect, useRef, type RefObject } from 'react';

export interface ElementRect {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const EMPTY_RECT: ElementRect = {
  centerX: 0,
  centerY: 0,
  width: 0,
  height: 0,
};

/**
 * Геометрия элемента в координатах viewport, положенная в ref.
 *
 * Возвращается ref, а не state, специально: значение читают
 * трансформеры motion на каждом кадре, и ререндер там не нужен.
 * Замер идёт по ResizeObserver и на скролле — не на каждом
 * движении мыши, иначе getBoundingClientRect устроит layout thrashing.
 */
export const useElementRect = <T extends HTMLElement>(
  ref: RefObject<T | null>,
): RefObject<ElementRect> => {
  const rect = useRef<ElementRect>(EMPTY_RECT);

  const measure = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    rect.current = {
      centerX: left + width / 2,
      centerY: top + height / 2,
      width,
      height,
    };
  }, [ref]);

  useEffect(() => {
    measure();

    const element = ref.current;
    const observer = new ResizeObserver(measure);
    if (element) observer.observe(element);

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure, ref]);

  return rect;
};
