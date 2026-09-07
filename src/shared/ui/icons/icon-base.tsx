import type { PropsWithChildren } from 'react';

import type { IconProps } from './types';

/**
 * Единая обёртка для контурных иконок: держит viewBox и stroke-атрибуты
 * в одном месте. Любой атрибут перебивается пропом на конкретной иконке.
 */
export const IconBase = ({
  children,
  ...props
}: PropsWithChildren<IconProps>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable={false}
    {...props}
  >
    {children}
  </svg>
);
