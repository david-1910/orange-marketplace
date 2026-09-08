import { buildProductPhoto, type Product } from '@/entities/product';
import { ScrollSwiper } from '@/shared/ui';

export interface ProductGalleryProps {
  product: Product;
}

/**
 * Галерея товара.
 *
 * Свайпер общий с лентой отзывов — примитив `ScrollSwiper` из shared:
 * прокрутка, снаппинг, стрелки и точки описаны один раз, а здесь
 * остаётся только содержимое кадров.
 */
export function ProductGallery({ product }: ProductGalleryProps) {
  const photoIds = [product.photoId, ...(product.galleryPhotoIds ?? [])];

  return (
    <ScrollSwiper
      ariaLabel={`Фотографии: ${product.title}`}
      hasDots
      trackClassName="bg-brand-50 rounded-3xl"
    >
      {photoIds.map((photoId, index) => (
        <div
          key={photoId}
          className="flex h-full items-center justify-center p-4"
        >
          {/* Фото целиком: object-contain плюс URL без кропа, чтобы
              товар не обрезался. Поля по краям — плата за это. */}
          <img
            src={buildProductPhoto(photoId, 1000)}
            alt={
              photoIds.length > 1
                ? `${product.title} — фото ${index + 1} из ${photoIds.length}`
                : product.title
            }
            // Первый кадр виден сразу, остальные подгружаются лениво.
            loading={index === 0 ? 'eager' : 'lazy'}
            className="max-h-[clamp(18rem,48vh,32rem)] w-auto max-w-full object-contain"
          />
        </div>
      ))}
    </ScrollSwiper>
  );
}
