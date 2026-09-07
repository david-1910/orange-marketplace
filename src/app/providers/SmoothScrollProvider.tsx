import { useEffect, type PropsWithChildren } from 'react';

import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

/**
 * Насколько «тяжёлым» ощущается скролл. Больше — медленнее и
 * дольше докатывается. Это единственная ручка, которую стоит
 * крутить при подборе ощущения.
 */
const SCROLL_DURATION = 1.2;

/**
 * Плавная замедленная прокрутка всей страницы.
 *
 * CSS scroll-behavior здесь не подходит: он действует только на
 * программные переходы и якоря, а колесо мыши прокручивает страницу
 * мгновенно. Lenis перехватывает событие колеса и сам догоняет
 * целевую позицию с интерполяцией.
 *
 * Важно, что Lenis двигает настоящий scrollTop документа, а не
 * transform на контейнере. Поэтому useScroll из motion, на котором
 * держатся нить прогресса и прилипание хедера, продолжает работать
 * без изменений.
 *
 * При prefers-reduced-motion не включается вовсе: перехват скролла —
 * ровно та анимация, от которой люди с вестибулярными нарушениями
 * страдают сильнее всего.
 */
export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: SCROLL_DURATION,
      // Экспоненциальное затухание: быстрый старт, мягкая остановка.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return children;
}
