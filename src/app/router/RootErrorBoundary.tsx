import { isRouteErrorResponse, useRouteError } from 'react-router';

import { ErrorState } from '@/shared/ui';

/**
 * Последний рубеж: ошибки рендера и роутинга.
 *
 * Это другой класс ошибок, чем упавший запрос. Ошибка запроса
 * локальна — падает список товаров, а хедер и навигация работают,
 * поэтому её ловит сам компонент через isError. Здесь же ловится
 * то, после чего страница уже не собралась.
 */
export function RootErrorBoundary() {
  const error = useRouteError();

  const description = isRouteErrorResponse(error)
    ? `${error.status}: ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Неизвестная ошибка';

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <ErrorState
        title="Что-то сломалось"
        description={description}
        onRetry={() => window.location.reload()}
        className="max-w-md"
      />
    </div>
  );
}
