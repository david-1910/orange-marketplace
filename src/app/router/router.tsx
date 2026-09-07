import { createBrowserRouter } from 'react-router';

import { CatalogPage } from '@/pages/catalog';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { ProductOverlay, ProductPage } from '@/pages/product';
import { ROUTES } from '@/shared/config';

import { RootErrorBoundary } from './RootErrorBoundary';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      {
        path: ROUTES.catalog,
        element: <CatalogPage />,
        // Overlay поверх живого каталога — так работает
        // layoutId-перелёт изображения товара.
        children: [
          { path: ROUTES.catalogProduct, element: <ProductOverlay /> },
        ],
      },
      // Прямой заход по ссылке, когда каталога в дереве нет.
      { path: ROUTES.product, element: <ProductPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
