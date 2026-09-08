import { Link } from 'react-router';

import { useFavoriteIds } from '@/entities/favorite';
import { ROUTES } from '@/shared/config';
import {
  EmptyState,
  IconArrowUpRight,
  LogoMonogram,
  SplitText,
} from '@/shared/ui';
import { ProductGrid } from '@/widgets/product-grid';

/**
 * Избранное. Страница только компонует: заголовок и сетку.
 *
 * Сетка — тот же виджет, что в каталоге и на главной: карточки,
 * состояния загрузки и каскад уже описаны там, дублировать их
 * незачем. Отличие только во входных данных (список id) и в тексте
 * пустого состояния, поэтому оба пришли пропсами.
 *
 * Фильтра по категории здесь нет осознанно: отложенных товаров
 * немного, и десять пилюль над списком из пары карточек только
 * шумят. Поэтому categoryId в сетку уходит как null — фильтрация
 * остаётся работой каталога.
 */
export function FavoritesPage() {
  const favoriteIds = useFavoriteIds();

  const hasFavorites = favoriteIds.length > 0;

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-label text-gray-400 uppercase">
          {favoriteIds.length
            ? `${favoriteIds.length} — Отложено`
            : '00 — Отложено'}
        </span>
        <p aria-hidden className="text-display-sm text-gray-900 uppercase">
          <SplitText text="Избранное" by="word" stagger={0.06} />
        </p>
        <h1 className="sr-only">Избранные товары</h1>
      </div>

      {hasFavorites ? (
        <ProductGrid
          categoryId={null}
          ids={favoriteIds}
          emptyState={
            <EmptyState
              title="Товары больше не продаются"
              description="Отложенное осталось, но этих товаров уже нет в каталоге."
            />
          }
        />
      ) : (
        <EmptyState
          icon={<LogoMonogram className="size-16" />}
          title="Пока ничего не отложено"
          description="Нажмите сердечко на карточке товара — он появится здесь."
          action={
            <Link
              to={ROUTES.catalog}
              className="text-label hover:border-brand-500 hover:text-brand-600 flex items-center gap-2 rounded-full border border-gray-900/10 px-5 py-3 text-gray-900 uppercase transition-colors"
            >
              В каталог
              <IconArrowUpRight className="size-4" />
            </Link>
          }
        />
      )}
    </div>
  );
}
