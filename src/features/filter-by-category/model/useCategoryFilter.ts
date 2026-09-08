import { useCallback } from 'react';

import { useSearchParams } from 'react-router';

import { CATALOG_CATEGORY_PARAM } from '@/entities/category';

export interface CategoryFilterState {
  /** null — «все категории». */
  categoryId: string | null;
  setCategoryId: (categoryId: string | null) => void;
}

/**
 * Выбранная категория каталога.
 *
 * Живёт в query-параметре, а не в состоянии компонента: ссылку на
 * отфильтрованный каталог можно отправить, и она откроется в том же
 * виде. Чтение и запись собраны здесь, в model фичи, — раньше они
 * лежали в ui страницы, и фича владела только внешним видом пилюль.
 */
export const useCategoryFilter = (): CategoryFilterState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setCategoryId = useCallback(
    (categoryId: string | null) => {
      setSearchParams(
        (params) => {
          if (categoryId) params.set(CATALOG_CATEGORY_PARAM, categoryId);
          else params.delete(CATALOG_CATEGORY_PARAM);
          return params;
        },
        // Смена фильтра не должна отматывать каталог к началу.
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return {
    categoryId: searchParams.get(CATALOG_CATEGORY_PARAM),
    setCategoryId,
  };
};
