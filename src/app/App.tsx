import { RouterProvider } from 'react-router';

import { QueryProvider, SmoothScrollProvider } from './providers';
import { router } from './router';

export function App() {
  return (
    <QueryProvider>
      <SmoothScrollProvider>
        <RouterProvider router={router} />
      </SmoothScrollProvider>
    </QueryProvider>
  );
}
