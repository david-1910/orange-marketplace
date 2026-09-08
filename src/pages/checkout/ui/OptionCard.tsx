import { cn } from '@/shared/lib';

export interface OptionCardProps {
  /** Общее имя группы — иначе радиокнопки не связаны между собой. */
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
  /** Приписка справа — например цена способа доставки. */
  meta?: string;
}

/**
 * Один вариант выбора: способ получения или способ оплаты.
 *
 * На настоящем `<input type="radio">`, спрятанном через peer: так
 * работают стрелки клавиатуры внутри группы, чтение группы
 * скринридером и фокус — всё то, что при замене на div с onClick
 * пришлось бы писать руками.
 *
 * Живёт в ui страницы, а не в shared: это не примитив, а конкретная
 * плашка выбора этого экрана. Понадобится второму экрану — переедет.
 */
export function OptionCard({
  name,
  value,
  isSelected,
  onSelect,
  title,
  hint,
  meta,
}: OptionCardProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition-colors',
        isSelected
          ? 'border-brand-500 bg-brand-50/50'
          : 'hover:border-brand-300 border-gray-900/10 bg-white',
      )}
    >
      <span className="flex items-start gap-3">
        <input
          type="radio"
          name={name}
          value={value}
          checked={isSelected}
          onChange={onSelect}
          className="peer sr-only"
        />

        <span
          aria-hidden
          className={cn(
            'peer-focus-visible:ring-brand-200 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:ring-2',
            isSelected ? 'border-brand-500' : 'border-gray-900/20',
          )}
        >
          {isSelected && (
            <span className="bg-brand-500 size-2.5 rounded-full" />
          )}
        </span>

        <span className="flex flex-col gap-1">
          <span className="text-ui font-medium text-gray-900">{title}</span>
          {hint && <span className="text-label text-gray-400">{hint}</span>}
        </span>
      </span>

      {meta && (
        <span className="text-price shrink-0 text-gray-900 tabular-nums">
          {meta}
        </span>
      )}
    </label>
  );
}
