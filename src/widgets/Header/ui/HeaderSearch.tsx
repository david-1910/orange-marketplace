import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { MOTION_TRANSITION, cursorLabel } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconClose, IconSearch } from '@/shared/ui';

export interface HeaderSearchProps {
  isFloating?: boolean;
}

/**
 * Иконка, раскрывающаяся в поле поиска.
 *
 * Раскрытие — layout-анимация motion: меняется не width в
 * ключевых кадрах, а сама разметка, а motion сам доводит геометрию.
 */
export function HeaderSearch({ isFloating = false }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      transition={MOTION_TRANSITION.ui}
      className={cn(
        'flex h-11 items-center gap-2 rounded-full border border-gray-900/10 px-3',
        isFloating ? 'bg-white/80 backdrop-blur-xl' : 'bg-white/40',
      )}
    >
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть поиск' : 'Открыть поиск'}
        onClick={() => setIsOpen((current) => !current)}
        {...cursorLabel(isOpen ? 'закрыть' : 'найти')}
        className="grid size-6 place-items-center text-gray-900"
      >
        {isOpen ? (
          <IconClose className="size-5" />
        ) : (
          <IconSearch className="size-5" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.input
            autoFocus
            type="search"
            placeholder="Искать товары"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={MOTION_TRANSITION.ui}
            className="text-ui bg-transparent outline-none placeholder:text-gray-400"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
