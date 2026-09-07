import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { CURSOR_LABEL_ATTRIBUTE, MOTION_TRANSITION } from '@/shared/config';
import { useMousePosition, usePointerFine } from '@/shared/hooks';

const LABEL_SELECTOR = `[${CURSOR_LABEL_ATTRIBUTE}]`;

/**
 * Кастомный курсор: оранжевая точка, которая на интерактивных
 * элементах разворачивается в плашку с подписью.
 *
 * Позиция берётся из общего useMousePosition напрямую, без пружины:
 * с пружиной курсор отставал от мыши и им было тяжело управлять.
 * Пружина осталась только на смене формы, где она незаметна.
 *
 * Подпись — плашка по ширине текста, а не круг фиксированного
 * размера: в круг 48px не влезало ни «в корзину», ни «вернуть».
 *
 * На тач-устройствах и при prefers-reduced-motion не рендерится
 * вообще: курсора там либо нет, либо он не должен ездить за мышью.
 */
export function CustomCursor() {
  const isPointerFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();
  const { x, y } = useMousePosition();
  const [label, setLabel] = useState<string | null>(null);

  const isActive = isPointerFine && !shouldReduceMotion;

  useEffect(() => {
    if (!isActive) return;

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const holder = target.closest(LABEL_SELECTOR);
      setLabel(holder?.getAttribute(CURSOR_LABEL_ATTRIBUTE) ?? null);
    };

    document.addEventListener('pointerover', handlePointerOver, {
      passive: true,
    });

    return () => document.removeEventListener('pointerover', handlePointerOver);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    document.body.classList.add('cursor-none');
    return () => document.body.classList.remove('cursor-none');
  }, [isActive]);

  if (!isActive) return null;

  const hasLabel = label !== null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed top-0 left-0 z-100"
    >
      <div className="relative">
        <motion.div
          className="bg-brand-500 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ scale: hasLabel ? 0 : 1 }}
          transition={MOTION_TRANSITION.ui}
        />

        <AnimatePresence>
          {hasLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={MOTION_TRANSITION.ui}
              className="text-label bg-brand-500 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2.5 whitespace-nowrap text-white uppercase"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
