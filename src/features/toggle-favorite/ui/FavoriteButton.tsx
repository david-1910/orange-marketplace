import { motion, useReducedMotion } from 'motion/react';

import { MOTION_DURATION } from '@/shared/config';
import { cn } from '@/shared/lib';
import { ClickSpark, IconHeart } from '@/shared/ui';

import { useToggleFavorite } from '../model/useToggleFavorite';

/**
 * overlay — кнопка поверх фотографии товара в карточке, ей нужна
 * подложка. plain — та же кнопка в строке корзины, где фон уже белый.
 */
export type FavoriteButtonVariant = 'overlay' | 'plain';

export interface FavoriteButtonProps {
  productId: string;
  variant?: FavoriteButtonVariant;
  className?: string;
}

const VARIANTS: Record<FavoriteButtonVariant, string> = {
  overlay: 'bg-white/80 backdrop-blur-md',
  plain: 'bg-transparent',
};

/** Сердце разгоняется и возвращается — «щелчок» в ответ на нажатие. */
const POP_KEYFRAMES = { scale: [1, 1.35, 0.95, 1] };

export function FavoriteButton({
  productId,
  variant = 'overlay',
  className,
}: FavoriteButtonProps) {
  const { isFavorite, label, toggle } = useToggleFavorite(productId);
  const shouldReduceMotion = useReducedMotion();

  return (
    // Искры только при добавлении: на снятии из избранного праздновать
    // нечего, а вспышка читалась бы как «получилось», хотя товар ушёл.
    <ClickSpark count={isFavorite ? 0 : 8} distance={26}>
      <button
        type="button"
        // Кнопка живёт внутри ссылки-карточки, поэтому клик и его
        // всплытие нужно погасить: иначе сердечко попутно уводило бы
        // на страницу товара.
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggle();
        }}
        aria-label={label}
        aria-pressed={isFavorite}
        className={cn(
          'grid size-9 place-items-center rounded-full transition-colors',
          VARIANTS[variant],
          isFavorite ? 'text-brand-500' : 'hover:text-brand-500 text-gray-400',
          className,
        )}
      >
        <motion.span
          // Ключ по состоянию перезапускает кадры на каждом
          // переключении: без него motion считает анимацию уже
          // проигранной и второй раз сердце не дёрнется.
          key={String(isFavorite)}
          initial={false}
          animate={shouldReduceMotion ? undefined : POP_KEYFRAMES}
          transition={{
            duration: MOTION_DURATION.section,
            times: [0, 0.4, 0.7, 1],
          }}
          className="grid place-items-center"
        >
          <IconHeart
            className="size-5"
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </motion.span>
      </button>
    </ClickSpark>
  );
}
