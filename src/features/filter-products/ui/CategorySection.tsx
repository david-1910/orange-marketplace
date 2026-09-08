import { motion } from 'motion/react';

import { useCategories } from '@/entities/category';
import { MOTION_TRANSITION } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';

export interface CategorySectionProps {
  /** null — «все категории». */
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

const ALL_ID = 'all';

/**
 * Категории вертикальным списком.
 *
 * Список, а не строка пилюль: десять категорий в строку не влезали и
 * переносились в две, отнимая пол-экрана. В боковой панели каждая
 * категория занимает одну строку и читается сверху вниз.
 *
 * Оранжевая подложка одна и физически перелетает между строками —
 * это layoutId: подложка существует в единственном экземпляре и
 * рендерится внутри активной строки, а motion сам анимирует её из
 * прежних координат в новые.
 */
export function CategorySection({ value, onChange }: CategorySectionProps) {
  const { data: categories, isPending } = useCategories();

  if (isPending) {
    return (
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 rounded-lg" />
        ))}
      </div>
    );
  }

  const options = [
    { id: ALL_ID, title: 'Все категории', emoji: '' },
    ...(categories ?? []),
  ];

  return (
    // Своя прокрутка только у списка категорий, и только на широких
    // экранах, где панель липкая. Категорий одиннадцать — это самая
    // длинная секция, и на ноутбучных 768px она выдавливала цену с
    // рейтингом за нижнюю кромку. Прокручивать панель целиком хуже:
    // цена и рейтинг нужны чаще, чем одиннадцатая категория, и
    // уезжать они не должны.
    <ul
      // В проекте стоит Lenis, и он перехватывает колесо на всём
      // документе. Без этого атрибута прокрутка внутри списка не
      // работала совсем: колесо над категориями крутило страницу.
      // Тот же приём уже применён в модалке и оверлее товара.
      data-lenis-prevent
      className="flex flex-col gap-0.5 lg:max-h-52 lg:overflow-y-auto"
    >
      {options.map((option) => {
        const isActive =
          option.id === ALL_ID ? value === null : value === option.id;

        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onChange(option.id === ALL_ID ? null : option.id)}
              aria-pressed={isActive}
              className={cn(
                'text-ui relative flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:bg-gray-900/5 hover:text-gray-900',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="category-row"
                  aria-hidden
                  // initial={false} гасит анимацию на монтировании:
                  // иначе подложка приезжает из случайной позиции при
                  // любом переобмере панели.
                  initial={false}
                  className="bg-brand-500 absolute inset-0 rounded-lg"
                  transition={MOTION_TRANSITION.ui}
                />
              )}

              <span className="relative flex items-center gap-2">
                {option.emoji && <span aria-hidden>{option.emoji}</span>}
                {option.title}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
