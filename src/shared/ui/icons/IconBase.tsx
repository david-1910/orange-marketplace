import type { PropsWithChildren, SVGProps } from 'react';

/**
 * Тип пропсов иконок объявлен здесь, а не в отдельном types.ts:
 * types.ts внутри сегмента ui запрещён регламентом, а `model/` у
 * слоя shared нет. Базовая обёртка и её пропсы — одна
 * ответственность, поэтому живут в одном файле.
 */
export type IconProps = SVGProps<SVGSVGElement>;

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
