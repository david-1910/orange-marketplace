import { useRef, useState, type PropsWithChildren } from 'react';

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
} from '@/shared/hooks';
import { cn } from '@/shared/lib';

export interface TiltedCardProps extends PropsWithChildren {
  /** Максимальный наклон в градусах. */
  maxTilt?: number;
  className?: string;
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * 3D-наклон карточки вслед за курсором.
 *
 * Наклон включается только под курсором. Без этого условия все
 * карточки сетки кланялись бы мыши одновременно, где бы она ни
 * находилась — эффект превратился бы в рябь по всему экрану.
 */
export function TiltedCard({
  maxTilt = 8,
  className,
  children,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useElementRect(ref);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const isPointerFine = usePointerFine();
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = isHovered && isPointerFine && !shouldReduceMotion;

  const rotateY = useSpring(
    useTransform(mouseX, (value) => {
      if (!isActive || !rect.current.width) return 0;
      return (
        clamp((value - rect.current.centerX) / (rect.current.width / 2)) *
        maxTilt
      );
    }),
    MOTION_TRANSITION.ui,
  );

  const rotateX = useSpring(
    useTransform(mouseY, (value) => {
      if (!isActive || !rect.current.height) return 0;
      return (
        -clamp((value - rect.current.centerY) / (rect.current.height / 2)) *
        maxTilt
      );
    }),
    MOTION_TRANSITION.ui,
  );

  return (
    <div ref={ref} className={cn('[perspective:900px]', className)}>
      <motion.div
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
