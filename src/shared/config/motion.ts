import type { Transition } from 'motion/react';

/** Кривая переходов секций из брифа. */
export const MOTION_EASE_OUT: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/** Длительности в секундах — motion принимает секунды, не миллисекунды. */
export const MOTION_DURATION = {
  micro: 0.18,
  section: 0.5,
} as const;

/** Шаг каскада: элементы крупные, поэтому стаггер больше обычного. */
export const MOTION_STAGGER = 0.07;

export const MOTION_TRANSITION = {
  /** Микро-взаимодействия: ховеры, тапы. */
  micro: { duration: MOTION_DURATION.micro, ease: 'easeOut' },
  /** Переходы секций. */
  section: { duration: MOTION_DURATION.section, ease: MOTION_EASE_OUT },
  /** Резкая «щелчковая» пружина для UI. */
  ui: { type: 'spring', stiffness: 400, damping: 25 },
  /** Ленивая тяжёлая пружина для появления. */
  enter: { type: 'spring', stiffness: 90, damping: 16 },
  /** Курсор: мягче UI, чтобы был заметен lag за мышью. */
  cursor: { type: 'spring', stiffness: 220, damping: 28, mass: 0.6 },
} satisfies Record<string, Transition>;
