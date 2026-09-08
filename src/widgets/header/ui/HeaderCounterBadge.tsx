import { motion, useReducedMotion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { useBumpOnChange } from '@/shared/lib';
import { Badge } from '@/shared/ui';

export interface HeaderCounterBadgeProps {
  count: number;
}

/**
 * Счётчик на иконке в шапке, подпрыгивающий при добавлении.
 *
 * Это и есть основной отклик на «положил в корзину» или «отложил»:
 * анимация происходит там, куда предмет попал, а не только под
 * пальцем. Кнопка в карточке далеко от шапки, и без этого пульса
 * непонятно, что действие вообще куда-то привело.
 *
 * Перезапуск — через key от useBumpOnChange: motion проигрывает
 * initial → animate заново только при смене ключа, поэтому пульс
 * срабатывает на каждое добавление, а не единожды при монтировании.
 *
 * Один компонент на оба счётчика (избранное и корзина): они
 * отличаются только числом, и разводить одинаковую анимацию по двум
 * местам значило бы менять её потом в двух местах.
 */
export function HeaderCounterBadge({ count }: HeaderCounterBadgeProps) {
  const bumpKey = useBumpOnChange(count);
  const shouldReduceMotion = useReducedMotion();

  // Ноль не показываем: пустой бейдж только шумит.
  if (count === 0) return null;

  return (
    <motion.span
      // При выключенной кинетике ключ постоянный, поэтому анимация не
      // перезапускается — бейдж просто меняет число.
      key={shouldReduceMotion ? 'static' : bumpKey}
      initial={shouldReduceMotion ? false : { scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={MOTION_TRANSITION.ui}
      className="absolute -top-1 -right-1"
    >
      <Badge className="tabular-nums">{count}</Badge>
    </motion.span>
  );
}
