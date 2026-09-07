import type { ReactNode } from 'react';

import { Link } from 'react-router';

import { ROUTES, buildPath, cursorLabel } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Badge, IconStar } from '@/shared/ui';

import { formatPrice, getDiscountPercent } from '../lib/formatPrice';
import { buildProductImage } from '../lib/productImage';
import type { Product } from '../model/types';

export interface ProductCardProps {
  product: Product;
  /**
   * Слот под действие — например кнопку «В корзину».
   *
   * Именно слот, а не импорт: кнопка живёт в features, а сущность
   * не имеет права импортировать слой выше себя. Виджет, который
   * собирает сетку, подставляет её сам.
   */
  action?: ReactNode;
  className?: string;
}

export function ProductCard({ product, action, className }: ProductCardProps) {
  const discount = getDiscountPercent(product);

  return (
    <article
      className={cn(
        'group hover:border-brand-300 hover:shadow-lifted flex h-full flex-col gap-3 rounded-2xl border border-gray-900/5 bg-white p-3 transition-all hover:-translate-y-0.5',
        !product.inStock && 'opacity-70',
        className,
      )}
    >
      <Link
        to={buildPath(ROUTES.catalogProduct, { id: product.id })}
        {...cursorLabel('смотреть')}
        className="flex flex-1 flex-col gap-3"
      >
        <div className="bg-brand-50 relative overflow-hidden rounded-xl">
          <img
            src={buildProductImage(product.photoId, 400)}
            alt={product.title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {discount !== null && <Badge>−{discount}%</Badge>}
            {!product.inStock && <Badge tone="neutral">Нет в наличии</Badge>}
          </div>
        </div>

        <p className="text-ui group-hover:text-brand-600 line-clamp-2 font-medium text-gray-900 transition-colors">
          {product.title}
        </p>

        <div className="text-label flex items-center gap-1.5 text-gray-400">
          <IconStar className="text-accent-500 size-3.5" />
          <span className="tabular-nums">{product.rating}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{product.reviewsCount}</span>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-price text-gray-900 tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-label text-gray-400 tabular-nums line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </Link>

      {action}
    </article>
  );
}
