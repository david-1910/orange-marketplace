import { useRef, type ReactNode } from 'react';

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import {
  useElementRect,
  useMousePosition,
  usePointerFine,
  type ElementRect,
  cn,
} from '@/shared/lib';

export interface MagnetProps {
  children: ReactNode;
  /** Радиус притяжения в пикселях. */
  radius?: number;
  /** Доля расстояния, на которую элемент тянется к курсору. */
  strength?: number;
  className?: string;
}

interface PullParams {
  pointerX: number;
  pointerY: number;
  rect: ElementRect;
  radius: number;
  strength: number;
}

/** Смещение элемента к курсору; вне радиуса — ноль. */
const getPull = ({
  pointerX,
  pointerY,
  rect,
  radius,
  strength,
}: PullParams) => {
  const deltaX = pointerX - rect.centerX;
  const deltaY = pointerY - rect.centerY;

  if (Math.hypot(deltaX, deltaY) > radius) return { x: 0, y: 0 };

  return { x: deltaX * strength, y: deltaY * strength };
};

/**
 * Элемент притягивается к курсору, когда тот входит в радиус.
 *
 * Позицию мыши берёт из общего useMousePosition, геометрию — из
 * useElementRect. Своих слушателей не навешивает, поэтому таких
 * магнитов на экране может быть сколько угодно.
 */
export function Magnet({
  children,
  radius = 160,
  strength = 0.35,
  className,
}: MagnetProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rect = useElementRect(ref);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const isPointerFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();

  const isActive = isPointerFine && !shouldReduceMotion;

  const pull = useTransform<number, { x: number; y: number }>(
    [mouseX, mouseY],
    ([pointerX, pointerY]) =>
      isActive
        ? getPull({
            pointerX,
            pointerY,
            rect: rect.current,
            radius,
            strength,
          })
        : { x: 0, y: 0 },
  );

  const x = useSpring(
    useTransform(pull, (value) => value.x),
    MOTION_TRANSITION.ui,
  );
  const y = useSpring(
    useTransform(pull, (value) => value.y),
    MOTION_TRANSITION.ui,
  );

  return (
    <motion.span
      ref={ref}
      style={isActive ? { x, y } : undefined}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.span>
  );
}
