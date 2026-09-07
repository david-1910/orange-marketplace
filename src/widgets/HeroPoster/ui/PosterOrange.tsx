import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { useMousePosition, usePointerFine } from '@/shared/hooks';
import { cn } from '@/shared/lib';
import { LogoMark } from '@/shared/ui';

export interface PosterOrangeProps {
  className?: string;
}

/** Максимальный наклон за курсором, градусы. */
const MAX_TILT = 9;

/**
 * Апельсин на месте буквы «O».
 *
 * Медленно парит и слегка кланяется курсору. Позиция мыши берётся
 * из общего useMousePosition, своего слушателя нет.
 *
 * По брифу здесь должна быть 3D-иллюстрация или Orb. Пока стоит наш
 * векторный знак: three/ogl — самая тяжёлая зависимость из всего
 * брифа, и её стоит вносить осознанно, а не заодно с вёрсткой.
 */
export function PosterOrange({ className }: PosterOrangeProps) {
  const { x: mouseX, y: mouseY } = useMousePosition();
  const isPointerFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();

  const canTilt = isPointerFine && !shouldReduceMotion;

  const tiltY = useSpring(
    useTransform(mouseX, (value) =>
      canTilt ? (value / window.innerWidth - 0.5) * 2 * MAX_TILT : 0,
    ),
    MOTION_TRANSITION.enter,
  );

  const tiltX = useSpring(
    useTransform(mouseY, (value) =>
      canTilt ? (0.5 - value / window.innerHeight) * 2 * MAX_TILT : 0,
    ),
    MOTION_TRANSITION.enter,
  );

  return (
    <motion.span
      className={cn('inline-block [perspective:600px]', className)}
      animate={shouldReduceMotion ? undefined : { y: [0, -14, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.span
        className="inline-block"
        style={canTilt ? { rotateX: tiltX, rotateY: tiltY } : undefined}
      >
        <LogoMark className="drop-shadow-lifted size-[0.92em]" />
      </motion.span>
    </motion.span>
  );
}
