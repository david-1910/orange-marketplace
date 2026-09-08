import { Outlet } from 'react-router';

import {
  CategoryFilter,
  useCategoryFilter,
} from '@/features/filter-by-category';
import { SplitText } from '@/shared/ui';
import { ProductGrid } from '@/widgets/product-grid';

/**
 * Каталог. Страница только собирает: заголовок, фильтр, сетку товаров.
 *
 * Выбранной категорией владеет фича: useCategoryFilter читает и пишет
 * query-параметр, страница лишь раздаёт значение фильтру и сетке —
 * так у обеих сторон один источник правды, а знание о самом параметре
 * из страницы ушло.
 *
 * Outlet держит место под overlay товара: каталог остаётся
 * смонтированным, поэтому изображение может перелететь из модуля
 * сетки в галерею через layoutId.
 */
export function CatalogPage() {
  const { categoryId, setCategoryId } = useCategoryFilter();

  return (
    <>
      <div className="mx-auto w-full max-w-[110rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-label text-gray-400 uppercase">
              02 — Каталог
            </span>
            <p aria-hidden className="text-display-sm text-gray-900 uppercase">
              <SplitText text="Всё сразу" by="word" stagger={0.06} />
            </p>
            <h1 className="sr-only">Каталог товаров</h1>
          </div>

          <CategoryFilter value={categoryId} onChange={setCategoryId} />
        </div>

        <ProductGrid categoryId={categoryId} />
      </div>

      <Outlet />
    </>
  );
}
