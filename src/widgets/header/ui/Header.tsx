import { useState } from 'react';

import { useMotionValueEvent, useScroll } from 'motion/react';
import { Link } from 'react-router';

import { useCartCount } from '@/entities/cart';
import { useFavoriteCount } from '@/entities/favorite';
import { SearchField } from '@/features/search-products';
import { ROUTES } from '@/shared/config';
import { IconCart, IconHeart, LogoFull } from '@/shared/ui';

import { HeaderAccount } from './HeaderAccount';
import { HeaderCounterBadge } from './HeaderCounterBadge';
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
 *
 * Магнитного притяжения к курсору у иконок нет: значки в шапке —
 * основная навигация, и уезжающая от курсора цель мешает по ней
 * попасть. Эффект остался там, где он декоративный, — в футере и на
 * плакате.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [isFloating, setIsFloating] = useState(false);
  const favoriteCount = useFavoriteCount();
  const cartCount = useCartCount();

  useMotionValueEvent(scrollY, 'change', (value) => {
    setIsFloating(value > FLOAT_AFTER);
  });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <HeaderShard isFloating={isFloating} className="px-3 py-2">
          <Link to={ROUTES.home}>
            <LogoFull />
          </Link>
        </HeaderShard>

        {/* Поиск и иконки в одном ряду: осколки остаются отдельными,
            но выровнены по одной линии, а не столбиком. */}
        <div className="flex items-center gap-3">
          <HeaderShard isFloating={isFloating}>
            <SearchField isFloating={isFloating} />
          </HeaderShard>

          <HeaderShard isFloating={isFloating}>
            <Link
              to={ROUTES.favorites}
              aria-label={
                favoriteCount
                  ? `Избранное, ${favoriteCount} товаров`
                  : 'Избранное'
              }
              className="hover:border-brand-500 hover:text-brand-600 relative grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900 transition-colors"
            >
              <IconHeart className="size-5" />
              <HeaderCounterBadge count={favoriteCount} />
            </Link>
          </HeaderShard>

          <HeaderShard isFloating={isFloating}>
            <Link
              to={ROUTES.cart}
              aria-label={
                cartCount ? `Корзина, ${cartCount} товаров` : 'Корзина'
              }
              className="hover:border-brand-500 hover:text-brand-600 relative grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900 transition-colors"
            >
              <IconCart className="size-5" />
              <HeaderCounterBadge count={cartCount} />
            </Link>
          </HeaderShard>

          <HeaderShard isFloating={isFloating}>
            <HeaderAccount />
          </HeaderShard>
        </div>
      </div>
    </header>
  );
}
