import { Outlet, useSearchParams } from 'react-router';

import { CategoryFilter } from '@/features/filter-by-category';
import { CATALOG_CATEGORY_PARAM } from '@/shared/config';
import { SplitText } from '@/shared/ui';
import { ProductGrid } from '@/widgets/product-grid';

/**
 * Каталог. Страница только собирает: заголовок, фильтр, сетку товаров.
 *
 * Выбранная категория живёт в query-параметре, а не в состоянии
 * компонента: ссылку на отфильтрованный каталог можно отправить,
 * и она откроется в том же виде. Страница читает параметр и раздаёт
 * его фильтру и сетке — так у обеих сторон один источник правды.
 *
 * Outlet держит место под overlay товара: каталог остаётся
 * смонтированным, поэтому изображение может перелететь из модуля
 * сетки в галерею через layoutId.
 */
export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get(CATALOG_CATEGORY_PARAM);

  const handleCategoryChange = (nextId: string | null) => {
    setSearchParams(
      (params) => {
        if (nextId) params.set(CATALOG_CATEGORY_PARAM, nextId);
        else params.delete(CATALOG_CATEGORY_PARAM);
        return params;
      },
      { preventScrollReset: true },
    );
  };

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

          <CategoryFilter value={categoryId} onChange={handleCategoryChange} />
        </div>

        <ProductGrid categoryId={categoryId} />
      </div>

      <Outlet />
    </>
  );
}
