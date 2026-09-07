import { motion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { cn } from '@/shared/lib';

export interface PosterStatProps {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}

/**
 * Мелкий редакционный блок: крупная цифра плюс микро-лейбл.
 *
 * Эти блоки и создают контраст размеров из пункта 1 брифа —
 * рядом со словом на пол-экрана стоит подпись в 11px. Без них
 * плакат превращается в пустое поле с одним словом.
 */
export function PosterStat({
  value,
  label,
  delay = 0,
  className,
}: PosterStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...MOTION_TRANSITION.section, delay }}
      className={cn('flex flex-col gap-1', className)}
    >
      <span className="text-title text-gray-900 tabular-nums">{value}</span>
      <span className="text-label max-w-[14ch] text-gray-500 uppercase">
        {label}
      </span>
    </motion.div>
  );
}
