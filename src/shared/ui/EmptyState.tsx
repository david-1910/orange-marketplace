import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center',
        className,
      )}
    >
      {icon && <div className="mb-3 text-5xl">{icon}</div>}
      <p className="mb-1 font-semibold">{title}</p>
      {description && (
        <p className="mb-4 text-sm text-gray-500">{description}</p>
      )}
      {action}
    </div>
  );
}
