import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import { ProductCard, useProducts } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { MOTION_STAGGER, MOTION_TRANSITION } from '@/shared/config';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui';

export interface ProductGridProps {
  categoryId: string | null;
  /** Сколько товаров показать. Без лимита — все. */
  limit?: number;
}

/** Пять товаров в ряд на широком экране, два на телефоне. */
const GRID_CLASSES =
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
 * Сетка товаров с каскадным появлением.
 *
 * LayoutGroup нужен смене фильтра: карточки не мигают, а физически
 * переезжают на новые места, потому что motion сопоставляет их по
 * layout между рендерами.
 *
 * Кнопку «В корзину» подставляет виджет, а не карточка: карточка
 * живёт в entities и не может импортировать features.
 */
export function ProductGrid({ categoryId, limit }: ProductGridProps) {
  const { data, isPending, isError, refetch } = useProducts(
    categoryId ? { categoryId } : {},
  );

  const products = limit ? data?.slice(0, limit) : data;

  if (isPending) {
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (!products?.length) {
    return (
      <EmptyState
        title="В этой категории пока пусто"
        description="Выберите другую категорию — товары появятся здесь."
      />
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        variants={GRID_VARIANTS}
        initial="hidden"
        animate="visible"
        className={GRID_CLASSES}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div key={product.id} layout variants={CARD_VARIANTS}>
              <ProductCard
                product={product}
                action={<AddToCartButton product={product} size="sm" />}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
