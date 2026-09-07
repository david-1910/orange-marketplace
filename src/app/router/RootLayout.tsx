import { Outlet } from 'react-router';

import { ScrollProgress } from '@/shared/ui';
import { CustomCursor } from '@/widgets/CustomCursor';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

/**
 * Общая оболочка всех страниц.
 *
 * Нить прогресса и кастомный курсор живут здесь: по брифу это
 * единственные элементы, постоянные на всех экранах. Header и Footer
 * придут сюда же, когда появятся как виджеты.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollProgress />
      <CustomCursor />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
