import type { SVGProps } from 'react';

export type LogoMonogramProps = SVGProps<SVGSVGElement>;

/** Монограмма «O» — печать, меши, лоадеры. */
export function LogoMonogram(props: LogoMonogramProps) {
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      focusable={false}
      {...props}
    >
      <circle cx="32" cy="32" r="26" stroke="#FF6B35" strokeWidth="10" />
      <path
        d="M32 6c0 0 6-4 12-1"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="8" r="3.5" fill="#10B981" />
    </svg>
  );
}
