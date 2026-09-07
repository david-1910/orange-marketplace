import { useNavigate } from 'react-router';

import { motion } from 'motion/react';

import { MOTION_TRANSITION, cursorLabel } from '@/shared/config';
import { useLockBodyScroll } from '@/shared/hooks';
import { IconClose } from '@/shared/ui';

import { ProductPage } from './ProductPage';

/**
 * Товар, раскрытый поверх каталога.
 *
 * Тот же ProductPage, только в оверлее — содержимое не дублируется.
 * Каталог под ним остаётся живым, что и делает возможным
 * layoutId-перелёт изображения из карточки.
 *
 * Прокрутка документа заблокирована: без этого на экране два
 * скроллбара — каталога под оверлеем и самого оверлея.
 *
 * AnimatePresence здесь нет намеренно: компонент размонтируется
 * вместе с роутом, поэтому анимировать собственный уход он не может.
 * Когда понадобится анимация закрытия, AnimatePresence встанет в
 * CatalogPage вокруг Outlet.
 */
export function ProductOverlay() {
  const navigate = useNavigate();
  useLockBodyScroll();

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-40 overflow-y-auto bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION_TRANSITION.section}
    >
      <button
        type="button"
        onClick={() => void navigate(-1)}
        aria-label="Закрыть"
        {...cursorLabel('закрыть')}
        className="hover:border-brand-500 hover:text-brand-600 fixed top-6 right-6 z-10 grid size-11 place-items-center rounded-full border border-gray-900/10 bg-white/80 text-gray-900 backdrop-blur-xl transition-colors"
      >
        <IconClose className="size-5" />
      </button>

      <ProductPage />
    </motion.div>
  );
}
