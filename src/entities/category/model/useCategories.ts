import { useQuery } from '@tanstack/react-query';

import { categoriesQuery } from '../api/categoryQueries';

/** Список категорий каталога. */
export const useCategories = () => useQuery(categoriesQuery());
