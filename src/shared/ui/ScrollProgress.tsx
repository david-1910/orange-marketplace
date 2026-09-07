import { useEffect, useState } from 'react';

import { motion, useMotionTemplate, useScroll, useSpring } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { cn } from '@/shared/lib';

export interface ScrollProgressProps {
  className?: string;
}

/** Прокручивается ли документ прямо сейчас. */
const useIsDocumentScrollable = (): boolean => {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const check = () => {
      const { scrollHeight } = document.documentElement;
      setIsScrollable(scrollHeight > window.innerHeight + 1);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(document.documentElement);
    window.addEventListener('resize', check);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', check);
    };
  }, []);

  return isScrollable;
};

/**
 * Сама линия. Вынесена в отдельный компонент не ради красоты:
 * useScroll снимает размеры документа при инициализации, поэтому
 * хуки обязаны создаваться уже после того, как страница стала
 * прокручиваемой. Ранний return в родителе убирает только DOM-узел,
 * а хуки продолжают жить со старым замером.
 */
function ProgressLine({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, MOTION_TRANSITION.ui);
  // transform строкой, а не style={{ scaleX }}: во втором случае
  // motion не пишет transform на монтировании, узел остаётся с
  // transform: none — то есть scaleX(1) — и наверху страницы полоса
  // выглядит как «прочитано целиком».
  const transform = useMotionTemplate`scaleX(${scaleX})`;

  return (
    <motion.div
      aria-hidden
      style={{ transform }}
      className={cn(
        'bg-brand-500 fixed inset-x-0 top-0 z-50 h-0.5 origin-left',
        className,
      )}
    />
  );
}

/**
 * Оранжевая нить прогресса страницы — единственный постоянный
 * элемент, связывающий все экраны.
 *
 * Намеренно без useReducedMotion: это индикатор состояния, а не
 * декоративная анимация. Пружина лишь сглаживает рывки колеса.
 *
 * На непрокручиваемой странице не рендерится: диапазон скролла там
 * нулевой, scrollYProgress равен 1, и полоса залилась бы целиком.
 */
export function ScrollProgress({ className }: ScrollProgressProps) {
  const isScrollable = useIsDocumentScrollable();

  if (!isScrollable) return null;

  return <ProgressLine className={className} />;
}
