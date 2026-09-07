import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import {
  buildProductImage,
  buildProductPhoto,
  type Product,
} from '@/entities/product';
import { MOTION_TRANSITION, cursorLabel } from '@/shared/config';
import { cn } from '@/shared/lib';

export interface ProductGalleryProps {
  product: Product;
}

/**
 * Галерея товара: крупное фото и миниатюры.
 *
 * Главное фото меняется через AnimatePresence с mode="wait" —
 * старое уходит, только потом появляется новое, иначе на стыке
 * видны оба кадра сразу.
 */
export function ProductGallery({ product }: ProductGalleryProps) {
  const photoIds = [product.photoId, ...(product.galleryPhotoIds ?? [])];
  const [activeId, setActiveId] = useState(product.photoId);

  return (
    <div className="flex flex-col gap-4">
      {/* Фото показывается целиком: object-contain плюс URL без
          кропа. Поля по краям — плата за то, что снимок не режется;
          высота при этом ограничена, иначе миниатюры уезжают
          за сгиб. */}
      <div className="bg-brand-50 flex items-center justify-center overflow-hidden rounded-3xl p-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeId}
            src={buildProductPhoto(activeId, 1000)}
            alt={product.title}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION_TRANSITION.section}
            className="max-h-[clamp(18rem,48vh,32rem)] w-auto max-w-full object-contain"
          />
        </AnimatePresence>
      </div>

      {photoIds.length > 1 && (
        <div className="flex gap-3">
          {photoIds.map((photoId) => (
            <button
              key={photoId}
              type="button"
              onClick={() => setActiveId(photoId)}
              aria-label="Показать фото"
              aria-pressed={photoId === activeId}
              {...cursorLabel('фото')}
              className={cn(
                'size-20 overflow-hidden rounded-2xl border-2 transition-colors',
                photoId === activeId
                  ? 'border-brand-500'
                  : 'hover:border-brand-300 border-transparent',
              )}
            >
              <img
                src={buildProductImage(photoId, 160)}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
