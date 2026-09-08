import type { ReactNode } from 'react';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import { ProductCard, type Product } from '@/entities/product';
import { CartItemControl } from '@/features/manage-cart-item';
import { FavoriteButton } from '@/features/toggle-favorite';
import { MOTION_STAGGER, MOTION_TRANSITION } from '@/shared/config';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui';

export interface ProductGridViewProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  /** Сколько скелетонов показать во время загрузки. */
  skeletonCount?: number;
  emptyState?: ReactNode;
  /** Классы раскладки сетки, если стандартная не подходит по ширине. */
  gridClassName?: string;
  /** Дописывается снизу сетки: сентинел ленты, кнопка «показать ещё». */
  children?: ReactNode;
}

/**
 * Пять товаров в ряд на широком экране, два на телефоне.
 *
 * Задаётся пропом, потому что сетка живёт в двух разных по ширине
 * местах: во всю ширину на главной и в правой колонке каталога рядом
 * с панелью фильтров. Одна и та же раскладка дала бы там растянутые
 * карточки, а тут — сплющенные.
 */
const DEFAULT_GRID_CLASSES =
  'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

const GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION_STAGGER } },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: MOTION_TRANSITION.section },
};

/**
 * Сетка товаров с каскадным появлением — только отрисовка.
 *
 * Данных не тянет: их подставляют ProductGrid (конечный список) и
 * ProductFeed (бесконечная лента). Разделение не косметическое —
 * хуки нельзя вызывать условно, поэтому один компонент не может
 * выбирать между useProducts и useInfiniteProducts.
 *
 * LayoutGroup нужен смене фильтра: карточки не мигают, а физически
 * переезжают на новые места, потому что motion сопоставляет их по
 * layout между рендерами.
 *
 * Кнопку «В корзину» и сердечко подставляет сетка, а не карточка:
 * карточка живёт в entities и не может импортировать features.
 */
export function ProductGridView({
  products,
  isLoading,
  isError,
  onRetry,
  skeletonCount = 10,
  emptyState,
  gridClassName = DEFAULT_GRID_CLASSES,
  children,
}: ProductGridViewProps) {
  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton key={index} className="aspect-3/4" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!products?.length) {
    return (
      emptyState ?? (
        <EmptyState
          title="В этой категории пока пусто"
          description="Выберите другую категорию — товары появятся здесь."
        />
      )
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        variants={GRID_VARIANTS}
        initial="hidden"
        animate="visible"
        className={gridClassName}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div key={product.id} layout variants={CARD_VARIANTS}>
              <ProductCard
                product={product}
                favoriteAction={<FavoriteButton productId={product.id} />}
                action={<CartItemControl product={product} size="sm" />}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {children}
    </LayoutGroup>
  );
}
