import { Link, useParams } from 'react-router';

import { useCartQuantity } from '@/entities/cart';
import { useCategory } from '@/entities/category';
import {
  formatPrice,
  getDiscountPercent,
  useProduct,
} from '@/entities/product';
import { CartItemControl } from '@/features/manage-cart-item';
import { FavoriteButton } from '@/features/toggle-favorite';
import { ROUTES } from '@/shared/config';
import {
  Accordion,
  Badge,
  ErrorState,
  IconArrowUpRight,
  IconStar,
  Skeleton,
  SplitText,
} from '@/shared/ui';
import { ProductGallery } from '@/widgets/product-gallery';
import { ProductReviews } from '@/widgets/product-reviews';

/**
 * Страница товара: асимметричный сплит 7:5 из пункта 3.6.
 *
 * Галерея слева прилипает, правая колонка прокручивается — при
 * длинных характеристиках фото остаётся на экране.
 */
export function ProductPage() {
  const { id } = useParams<'id'>();
  const { data: product, isPending, isError, refetch } = useProduct(id);
  const { data: category } = useCategory(product?.categoryId);
  const cartQuantity = useCartQuantity(product?.id ?? '');

  if (isPending) {
    return (
      <div className="mx-auto grid w-full max-w-360 gap-10 px-4 pt-28 pb-20 sm:px-8 lg:grid-cols-12">
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

  return (
    <div className="mx-auto grid w-full max-w-360 gap-10 px-4 pt-24 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-16">
      <div className="flex flex-col gap-10 lg:col-span-7">
        <ProductGallery product={product} />

        {/* Отзывы прямо под фотографиями, как вы и просили. Галерея
            из-за этого перестала прилипать: прилипший блок увёз бы
            отзывы за пределы экрана, и до них нельзя было бы
            добраться прокруткой. */}
        <ProductReviews
          productId={product.id}
          rating={product.rating}
          reviewsCount={product.reviewsCount}
        />
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="text-label flex items-center gap-2 text-gray-400 uppercase">
          <Link
            to={ROUTES.catalog}
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
          {/* Цена набрана title, а не display: в сумах это 14 знаков,
              и display-sm на 64px рвал сумму на две строки в колонке
              5/12. Плакатную роль на этой странице играет название
              товара, цене крупнее title быть незачем. */}
          <span className="text-title whitespace-nowrap text-gray-900 tabular-nums">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="text-total whitespace-nowrap text-gray-400 tabular-nums line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}

          {discount !== null && <Badge className="mb-2">−{discount}%</Badge>}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-stretch gap-3">
            <CartItemControl product={product} className="flex-1" />

            {/* Сердечко рядом с кнопкой корзины, а не в углу фото:
                на странице товара решение «куплю потом» принимают
                здесь же, где смотрят на цену. Размер подогнан под
                контрол — tailwind-merge заменяет базовый size-9. */}
            <FavoriteButton
              productId={product.id}
              variant="plain"
              className="size-14 shrink-0 rounded-full border border-gray-900/10"
            />
          </div>

          {/* Появляется только когда товар уже в корзине: до этого
              оформлять нечего, и кнопка звала бы в пустой чекаут. */}
          {cartQuantity > 0 && (
            <Link
              to={ROUTES.checkout}
              className="text-label hover:border-brand-500 hover:text-brand-600 flex h-12 items-center justify-center gap-2 rounded-full border border-gray-900/10 text-gray-900 uppercase transition-colors"
            >
              Перейти к оформлению
              <IconArrowUpRight className="size-4" />
            </Link>
          )}
        </div>

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
