import { useState, type PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Данные каталога не меняются на глазах, поэтому не
        // перезапрашиваем их при каждом возврате на вкладку.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

/**
 * QueryClient создаётся в useState, а не в модуле: иначе он был бы
 * общим для всех рендеров, включая тесты, и кеш протекал бы между ними.
 */
export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
