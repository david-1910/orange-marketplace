import { Toaster as SonnerToaster } from 'sonner';

/**
 * Область уведомлений.
 *
 * Обёртка задаёт вид под проект: скругления и тени из токенов темы,
 * позиция снизу справа — там уведомление не накрывает ни шапку с
 * поиском, ни липкую панель фильтров слева.
 *
 * Монтируется один раз в app: две области уведомлений на странице
 * означали бы, что часть событий уходит не туда, где их ждут.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      // Отступ снизу больше стандартного: на странице товара внизу
      // липнет полоса прокрутки галереи, а на телефоне — дом-бар.
      offset={24}
      duration={3200}
      toastOptions={{
        classNames: {
          toast:
            'text-ui !rounded-2xl !border-gray-900/5 !bg-white !text-gray-900 !shadow-float',
          description: '!text-gray-500',
          actionButton: 'text-label !rounded-full !bg-gray-900 !text-white',
          success: '!text-success-600',
          error: '!text-error-600',
        },
      }}
    />
  );
}
