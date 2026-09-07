import { cn } from '@/shared/lib';

import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Если передан — рисуется кнопка повтора. */
  onRetry?: () => void;
  className?: string;
}

/**
 * Честное состояние ошибки. Ключевое отличие от EmptyState: пустой
 * список значит «здесь ничего нет», ошибка значит «мы не смогли
 * загрузить». Путать их нельзя — во втором случае у пользователя
 * должна быть кнопка повтора, а не предложение пойти в каталог.
 */
export function ErrorState({
  title = 'Не удалось загрузить',
  description = 'Проверьте соединение и попробуйте ещё раз.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'border-error-500/40 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-white p-12 text-center',
        className,
      )}
    >
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>

      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Повторить
        </Button>
      )}
    </div>
  );
}
