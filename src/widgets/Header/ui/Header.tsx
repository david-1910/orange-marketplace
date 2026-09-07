import { useState } from 'react';

import { useMotionValueEvent, useScroll } from 'motion/react';
import { Link } from 'react-router';

import { ROUTES, cursorLabel } from '@/shared/config';
import { Badge, IconCart, IconHeart, LogoFull, Magnet } from '@/shared/ui';

import { HeaderSearch } from './HeaderSearch';
import { HeaderShard } from './HeaderShard';

/** После какого сдвига осколки прилипают. */
const FLOAT_AFTER = 24;

/**
 * Хедер как четыре плавающих элемента по углам, а не полоса.
 *
 * При скролле они получают backdrop-blur и тень, но остаются
 * отдельными — в единую панель не сливаются, это требование 3.1.
 *
 * Контейнер сквозной для событий (pointer-events-none), каждый
 * осколок возвращает себе кликабельность: иначе прозрачная
 * подложка перехватывала бы клики по плакату.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [isFloating, setIsFloating] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => {
    setIsFloating(value > FLOAT_AFTER);
  });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <HeaderShard isFloating={isFloating} className="px-3 py-2">
          <Link to={ROUTES.home} {...cursorLabel('на главную')}>
            <LogoFull />
          </Link>
        </HeaderShard>

        {/* Поиск и иконки в одном ряду: осколки остаются отдельными,
            но выровнены по одной линии, а не столбиком. */}
        <div className="flex items-center gap-3">
          <HeaderShard isFloating={isFloating}>
            <HeaderSearch isFloating={isFloating} />
          </HeaderShard>

          <HeaderShard isFloating={isFloating}>
            <Magnet radius={40} strength={0.4}>
              <button
                type="button"
                aria-label="Избранное"
                {...cursorLabel('избранное')}
                className="grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900"
              >
                <IconHeart className="size-5" />
              </button>
            </Magnet>
          </HeaderShard>

          <HeaderShard isFloating={isFloating}>
            <Magnet radius={40} strength={0.4}>
              <button
                type="button"
                aria-label="Корзина"
                {...cursorLabel('корзина')}
                className="relative grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900"
              >
                <IconCart className="size-5" />
                <Badge className="absolute -top-1 -right-1 tabular-nums">
                  0
                </Badge>
              </button>
            </Magnet>
          </HeaderShard>
        </div>
      </div>
    </header>
  );
}
