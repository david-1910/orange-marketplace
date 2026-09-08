import { createBrowserRouter } from 'react-router';

import { CartPage } from '@/pages/cart';
import { CatalogPage } from '@/pages/catalog';
import { CheckoutPage } from '@/pages/checkout';
import { FavoritesPage } from '@/pages/favorites';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { OrderPage } from '@/pages/order';
import { ProductOverlay, ProductPage } from '@/pages/product';
import { ProfilePage } from '@/pages/profile';
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
        children: [
          { path: ROUTES.catalogProduct, element: <ProductOverlay /> },
        ],
      },
      // Прямой заход по ссылке, когда каталога в дереве нет.
      { path: ROUTES.product, element: <ProductPage /> },
      { path: ROUTES.favorites, element: <FavoritesPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.checkout, element: <CheckoutPage /> },
      { path: ROUTES.order, element: <OrderPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
