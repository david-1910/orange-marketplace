import { motion, useReducedMotion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { useFontsReady } from '@/shared/hooks';

export type SplitTextUnit = 'char' | 'word';
export type SplitTextTrigger = 'mount' | 'inView';

export interface SplitTextProps {
  text: string;
  /** Что анимируем — буквы или слова. */
  by?: SplitTextUnit;
  trigger?: SplitTextTrigger;
  /** Задержка перед началом каскада, секунды. */
  delay?: number;
  /** Шаг каскада, секунды. По брифу для плаката — 0.04. */
  stagger?: number;
  className?: string;
}

const REVEAL_INITIAL = { y: '110%' };
const REVEAL_TARGET = { y: '0%' };

/**
 * Порезанный на части текст, который въезжает снизу.
 *
 * Каждая часть сидит в собственной обёртке с overflow-hidden —
 * поэтому это именно выезд из-за края, а не появление со сдвигом.
 * Само слово остаётся одним aria-label, а части скрыты от
 * скринридера: иначе он прочитает текст по буквам.
 */
export function SplitText({
  text,
  by = 'char',
  trigger = 'mount',
  delay = 0,
  stagger = 0.04,
  className,
}: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const areFontsReady = useFontsReady();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const parts = by === 'word' ? text.split(' ') : Array.from(text);
  // Каскад ждёт шрифт: иначе буквы выедут системным начертанием
  // и дёрнутся, когда подгрузится Montserrat.
  const isInView = trigger === 'inView';
  const canReveal = areFontsReady;

  return (
    <span aria-label={text} className={className}>
      {parts.map((part, index) => (
        <span
          // Буквы повторяются, поэтому индекс здесь — единственный
          // корректный ключ: порядок частей неизменен.
          key={`${part}-${index}`}
          aria-hidden
          className="inline-flex overflow-hidden align-bottom"
        >
          <motion.span
            // whitespace-pre обязателен: пробел внутри inline-flex
            // с overflow-hidden иначе схлопнется в ноль.
            className="inline-block whitespace-pre"
            initial={REVEAL_INITIAL}
            animate={isInView || !canReveal ? undefined : REVEAL_TARGET}
            whileInView={isInView && canReveal ? REVEAL_TARGET : undefined}
            viewport={isInView ? { once: true, amount: 0.6 } : undefined}
            transition={{
              ...MOTION_TRANSITION.enter,
              delay: delay + index * stagger,
            }}
          >
            {part === ' ' ? ' ' : part}
            {by === 'word' && index < parts.length - 1 ? ' ' : null}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
