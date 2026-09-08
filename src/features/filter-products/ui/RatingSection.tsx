import { cn } from '@/shared/lib';
import { IconStar } from '@/shared/ui';

export interface RatingSectionProps {
  value: number | null;
  onChange: (rating: number | null) => void;
}

/**
 * Порог рейтинга.
 *
 * Порог, а не точное значение: «ровно 4.5» покупателю не нужно, ему
 * нужно «не хуже 4.5». Поэтому варианты читаются как «4.5 и выше».
 */
const THRESHOLDS = [4.8, 4.5, 4] as const;

export function RatingSection({ value, onChange }: RatingSectionProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {THRESHOLDS.map((threshold) => {
        const isActive = value === threshold;

        return (
          <button
            key={threshold}
            type="button"
            // Повторное нажатие снимает фильтр: отдельная кнопка
            // «любой рейтинг» заняла бы место ради того же действия.
            onClick={() => onChange(isActive ? null : threshold)}
            aria-label={`Рейтинг ${threshold} и выше`}
            aria-pressed={isActive}
            className={cn(
              'text-ui flex items-center gap-1.5 rounded-full border px-3 py-1.5 tabular-nums transition-colors',
              isActive
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'hover:border-brand-400 border-gray-900/10 text-gray-500 hover:text-gray-900',
            )}
          >
            <IconStar
              className={cn('size-3.5', !isActive && 'text-accent-500')}
              fill="currentColor"
            />
            {/* Подпись короткая, чтобы три порога влезли в одну строку
                узкой панели. Для скринридера — полная формулировка в
                aria-label выше: «4.8+» на слух ничего не значит. */}
            {threshold}+
          </button>
        );
      })}
    </div>
  );
}
