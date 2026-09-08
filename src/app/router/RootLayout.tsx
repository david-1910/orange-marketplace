import { Outlet } from 'react-router';

import { ScrollProgress, Toaster } from '@/shared/ui';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

/**
 * Общая оболочка всех страниц.
 *
 * Нить прогресса живёт здесь: это единственный декоративный элемент,
 * постоянный на всех экранах. Указатель оставлен нативным — в
 * магазине курсор работает индикатором «это кликабельно», и подменять
 * его значило бы гасить аффордансы ссылок, кнопок и текста.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollProgress />
      <Toaster />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
