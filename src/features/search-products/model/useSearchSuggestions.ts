import { type Product, useProducts } from '@/entities/product';
import { useDebouncedValue } from '@/shared/lib';

/** Сколько подсказок показываем: больше не влезает и не нужно. */
const SUGGESTIONS_LIMIT = 6;

/** С какой длины запроса начинаем искать. */
const MIN_QUERY_LENGTH = 2;

export interface SearchSuggestions {
  items: Product[];
  isLoading: boolean;
  /** Запрос достаточно длинный, чтобы что-то искать. */
  isActive: boolean;
  /** Искали и ничего не нашли. */
  isEmpty: boolean;
}

/**
 * Подсказки для поля поиска.
 *
 * Запрос отстаёт от ввода на задержку: иначе он уходил бы на каждое
 * нажатие клавиши, и в подсказках мелькали бы результаты недонабранных
 * слов.
 *
 * Одна буква не ищется: по ней в выдачу попадает половина каталога, и
 * подсказки перестают что-либо подсказывать.
 */
export const useSearchSuggestions = (query: string): SearchSuggestions => {
  const debouncedQuery = useDebouncedValue(query.trim());

  const isActive = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data, isLoading } = useProducts(
    { query: debouncedQuery, limit: SUGGESTIONS_LIMIT, sort: 'price-asc' },
    { isEnabled: isActive },
  );

  return {
    items: isActive ? (data ?? []) : [],
    isLoading: isActive && isLoading,
    isActive,
    isEmpty: isActive && !isLoading && (data?.length ?? 0) === 0,
  };
};
