import { useCallback } from 'react';

import { useSearchParams } from 'react-router';

/** Имя query-параметра с поисковым запросом. */
export const SEARCH_PARAM = 'q';

export interface ProductSearchState {
  /** Текущий запрос; пустая строка — поиска нет. */
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
}

/**
 * Поисковый запрос каталога.
 *
 * Живёт в query-параметре, а не в состоянии компонента: ссылку на
 * результаты поиска можно отправить, «назад» возвращает предыдущий
 * запрос, а перезагрузка не теряет введённое.
 *
 * Отдельная фича, а не часть filter-products: поиск задаётся из шапки,
 * то есть с любой страницы, а фильтры — только в каталоге. Смешивать
 * их в одном слайсе значило бы тащить шапку в зависимости фильтров.
 */
export const useProductSearch = (): ProductSearchState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get(SEARCH_PARAM) ?? '';

  const setQuery = useCallback(
    (next: string) => {
      setSearchParams(
        (params) => {
          const trimmed = next.trim();

          if (trimmed) params.set(SEARCH_PARAM, trimmed);
          else params.delete(SEARCH_PARAM);

          return params;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return {
    query,
    setQuery,
    clear: useCallback(() => setQuery(''), [setQuery]),
  };
};
