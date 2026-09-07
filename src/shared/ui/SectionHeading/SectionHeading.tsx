import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface SectionHeadingProps {
  /** Микро-лейбл над заголовком: «02 — Каталог». */
  label?: string;
  title: string;
  /** Ссылка или кнопка справа — например «Все товары». */
  action?: ReactNode;
  className?: string;
}

/**
 * Шапка секции: микро-лейбл, крупный заголовок и действие справа.
 * Контраст размеров 11px против 40px — тот самый приём из брифа.
 */
export function SectionHeading({
  label,
  title,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-4',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {label && (
          <span className="text-label text-gray-400 uppercase">{label}</span>
        )}
        <h2 className="text-title text-gray-900 uppercase">{title}</h2>
      </div>

      {action}
    </div>
  );
}
