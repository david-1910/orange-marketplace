import { cn } from '@/shared/lib';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-xl bg-gray-100', className)}
    />
  );
}
