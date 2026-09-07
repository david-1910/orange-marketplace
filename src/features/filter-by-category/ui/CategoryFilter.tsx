import { motion } from 'motion/react';

import { useCategories } from '@/entities/product';
import { MOTION_TRANSITION, cursorLabel } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';

export interface CategoryFilterProps {
  /** null — «все категории». */
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

const ALL_ID = 'all';

/**
 * Пилюли категорий с одной оранжевой подложкой, которая физически
 * перелетает между ними.
 *
 * Перелёт даёт layoutId: подложка существует в единственном
 * экземпляре и рендерится внутри активной пилюли, а motion сам
 * анимирует её из прежних координат в новые.
 */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data: categories, isPending } = useCategories();

  if (isPending) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  const options = [
    { id: ALL_ID, title: 'Все', emoji: '' },
    ...(categories ?? []),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive =
          option.id === ALL_ID ? value === null : value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id === ALL_ID ? null : option.id)}
            {...cursorLabel(option.title)}
            className={cn(
              'text-label relative rounded-full border px-4 py-2 uppercase transition-colors',
              isActive
                ? 'border-transparent text-white'
                : 'border-gray-900/10 text-gray-500 hover:text-gray-900',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                aria-hidden
                // initial={false} гасит анимацию на монтировании:
                // иначе подложка приезжает из случайной позиции при
                // любом переобмере страницы, и в кадре видно, как она
                // висит поверх соседней пилюли.
                initial={false}
                className="bg-brand-500 absolute inset-0 rounded-full"
                transition={MOTION_TRANSITION.ui}
              />
            )}

            <span className="relative flex items-center gap-1.5">
              {option.emoji && <span aria-hidden>{option.emoji}</span>}
              {option.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
