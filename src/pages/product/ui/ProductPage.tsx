import { Link, useParams } from 'react-router';

import {
  formatPrice,
  getDiscountPercent,
  useCategories,
  useProduct,
} from '@/entities/product';
import { AddToCartButton } from '@/features/cart/add-to-cart';
import { ROUTES, cursorLabel } from '@/shared/config';
import {
  Accordion,
  Badge,
  ErrorState,
  IconStar,
  Skeleton,
  SplitText,
} from '@/shared/ui';
import { ProductGallery } from '@/widgets/ProductGallery';

/**
 * Страница товара: асимметричный сплит 7:5 из пункта 3.6.
 *
 * Галерея слева прилипает, правая колонка прокручивается — при
 * длинных характеристиках фото остаётся на экране.
 */
export function ProductPage() {
  const { id } = useParams<'id'>();
  const { data: product, isPending, isError, refetch } = useProduct(id);
  const { data: categories } = useCategories();

  if (isPending) {
    return (
      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-4 pt-28 pb-20 sm:px-8 lg:grid-cols-12">
        <Skeleton className="aspect-square lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-md px-4 pt-32 pb-20">
        <ErrorState
          title="Товар не найден"
          description="Возможно, он больше не продаётся."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const discount = getDiscountPercent(product);
  const category = categories?.find((item) => item.id === product.categoryId);

  return (
    <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-4 pt-24 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <ProductGallery product={product} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="text-label flex items-center gap-2 text-gray-400 uppercase">
          <Link
            to={ROUTES.catalog}
            {...cursorLabel('каталог')}
            className="hover:text-brand-600 transition-colors"
          >
            Каталог
          </Link>
          {category && <span aria-hidden>—</span>}
          {category && <span>{category.title}</span>}
        </div>

        <h1 className="text-display-sm text-gray-900">
          <SplitText text={product.title} by="word" stagger={0.05} />
        </h1>

        <div className="text-ui flex items-center gap-2 text-gray-500">
          <IconStar className="text-accent-500 size-4" />
          <span className="tabular-nums">{product.rating}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{product.reviewsCount} отзывов</span>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <span className="text-display-sm text-gray-900 tabular-nums">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="text-title text-gray-400 tabular-nums line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}

          {discount !== null && <Badge className="mb-2">−{discount}%</Badge>}
        </div>

        <AddToCartButton product={product} />

        <Accordion
          defaultOpenId="specs"
          items={[
            {
              id: 'specs',
              title: 'Характеристики',
              content: (
                <dl className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <dt>Категория</dt>
                    <dd className="text-gray-900">{category?.title ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Наличие</dt>
                    <dd className="text-gray-900">
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Рейтинг</dt>
                    <dd className="text-gray-900 tabular-nums">
                      {product.rating} из 5
                    </dd>
                  </div>
                </dl>
              ),
            },
            {
              id: 'delivery',
              title: 'Доставка',
              content: 'Доставка по Ташкенту за 2 часа. По регионам — 1–3 дня.',
            },
            {
              id: 'returns',
              title: 'Возврат',
              content: 'Возврат в течение 30 дней без объяснения причин.',
            },
          ]}
        />
      </div>
    </div>
  );
}
