import { useEffect } from 'react';

import { motionValue, type MotionValue } from 'motion/react';

/**
 * Единственный источник позиции курсора на всё приложение.
 *
 * MotionValue живут на уровне модуля, а слушатель навешивается один раз
 * при первом использовании. Поэтому десяток магнитов, спотлайтов и наклонов
 * на одном экране дают один обработчик pointermove, а не десять,
 * и ни один из них не вызывает ререндер React.
 */
const mouseX = motionValue(0);
const mouseY = motionValue(0);

let isListenerAttached = false;

const handlePointerMove = (event: PointerEvent) => {
  mouseX.set(event.clientX);
  mouseY.set(event.clientY);
};

export interface MousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export const useMousePosition = (): MousePosition => {
  useEffect(() => {
    if (isListenerAttached) return;

    isListenerAttached = true;
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
  }, []);

  return { x: mouseX, y: mouseY };
};
