import type { PropsWithChildren } from 'react';

import { cn } from '@/shared/lib';

export interface HeaderShardProps extends PropsWithChildren {
  isFloating: boolean;
  className?: string;
}

/**
 * Оболочка одного «осколка» хедера.
 *
 * Существует ровно для того, чтобы состояние прилипания было
 * описано один раз, а не скопировано в каждый из четырёх углов.
 */
export function HeaderShard({
  isFloating,
  className,
  children,
}: HeaderShardProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto rounded-full transition-all duration-300',
        isFloating && 'shadow-soft bg-white/70 backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
