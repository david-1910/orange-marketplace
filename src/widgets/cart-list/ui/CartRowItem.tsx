import { Link } from 'react-router';

import { useCartActions } from '@/entities/cart';
import { buildProductImage, formatPrice } from '@/entities/product';
import { CartItemControl } from '@/features/manage-cart-item';
import { FavoriteButton } from '@/features/toggle-favorite';
import { ROUTES, buildPath } from '@/shared/config';
import { Badge, Checkbox, IconClose } from '@/shared/ui';

import type { CartRow } from '../model/useCartRows';

export interface CartRowItemProps {
  row: CartRow;
  isSelected: boolean;
  onSelectedChange: (isSelected: boolean) => void;
}

/**
 * Одна позиция корзины: выбор, фото, название, степпер, цена и
 * действия «в избранное» и «удалить».
 *
 * Сердечко и степпер приходят из features — виджет их композирует.
 * Удаление берётся прямо из сущности: это не сценарий со своей
 * логикой, а один вызов стора.
 */
export function CartRowItem({
  row,
  isSelected,
  onSelectedChange,
}: CartRowItemProps) {
  const { remove } = useCartActions();
  const { product, quantity, price, oldPrice } = row;

  const linePrice = price * quantity;
  const lineOldPrice = oldPrice ? oldPrice * quantity : null;

  return (
    <li className="flex gap-4 border-t border-gray-900/5 py-5 first:border-t-0 first:pt-0">
      <Checkbox
        checked={isSelected}
        onChange={(event) => onSelectedChange(event.target.checked)}
        label={`Выбрать ${product.title}`}
        isLabelHidden
        className="pt-1"
      />

      <Link
        to={buildPath(ROUTES.product, { id: product.id })}
        className="bg-brand-50 size-24 shrink-0 overflow-hidden rounded-xl sm:size-28"
      >
        <img
          src={buildProductImage(product.photoId, 224)}
          alt={product.title}
          loading="lazy"
          className="size-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <Link
            to={buildPath(ROUTES.product, { id: product.id })}
            className="text-ui hover:text-brand-600 line-clamp-2 font-medium text-gray-900 transition-colors"
          >
            {product.title}
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <FavoriteButton productId={product.id} variant="plain" />
            <button
              type="button"
              onClick={() => remove(product.id)}
              aria-label={`Удалить ${product.title} из корзины`}
              className="hover:text-error-600 grid size-9 place-items-center rounded-full text-gray-400 transition-colors"
            >
              <IconClose className="size-5" />
            </button>
          </div>
        </div>

        {!product.inStock && <Badge tone="neutral">Нет в наличии</Badge>}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          {/* Степпер узкий: в строке он один из нескольких блоков,
              а не главное действие, как в карточке. */}
          <div className="w-36">
            <CartItemControl product={product} size="sm" />
          </div>

          <div className="flex flex-col items-end">
            <span className="text-price text-gray-900 tabular-nums">
              {formatPrice(linePrice)}
            </span>
            {lineOldPrice && (
              <span className="text-label text-gray-400 tabular-nums line-through">
                {formatPrice(lineOldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
