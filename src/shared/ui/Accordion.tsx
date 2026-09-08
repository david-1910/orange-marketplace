import { useState, type ReactNode } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { cn } from '@/shared/lib';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Какой раздел открыт изначально. */
  defaultOpenId?: string;
  className?: string;
}

/**
 * Аккордеон с анимацией высоты.
 *
 * height анимируется до 'auto': motion умеет это делать, замеряя
 * содержимое, поэтому раздел не нужно ограничивать фиксированной
 * высотой и текст любой длины раскрывается плавно.
 */
export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn('flex flex-col divide-y divide-gray-900/10', className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-ui font-semibold text-gray-900">
                {item.title}
              </span>

              {/* Плюс превращается в минус: вертикальный штрих
                  сжимается по высоте. Поворот текстового «+» на 45°
                  дал бы крестик, а не минус. */}
              <span aria-hidden className="relative size-4 shrink-0">
                <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded-full bg-gray-400" />
                <motion.span
                  animate={{ scaleY: isOpen ? 0 : 1 }}
                  transition={MOTION_TRANSITION.ui}
                  className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded-full bg-gray-400"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={MOTION_TRANSITION.ui}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-sm text-gray-500">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
