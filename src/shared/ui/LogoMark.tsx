import { useId, type SVGProps } from 'react';

export type LogoMarkProps = SVGProps<SVGSVGElement>;

/**
 * Знак логотипа: апельсин с листиком.
 * id градиента генерируется через useId — иначе несколько знаков
 * на одной странице поделят один <radialGradient>.
 */
export function LogoMark(props: LogoMarkProps) {
  const gradientId = useId();

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
      <path
        d="M32 14c0 0 7-7 14-3.5s3.5 10.5 0 10.5-10-3.5-14-7z"
        fill="#10B981"
      />
      <path
        d="M33 15c2 1.5 5 3.5 8 4.5"
        stroke="#065F46"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="32" cy="38" r="22" fill="#FF6B35" />
      <circle
        cx="32"
        cy="38"
        r="22"
        fill={`url(#${gradientId})`}
        opacity="0.35"
      />
      <ellipse
        cx="23"
        cy="30"
        rx="5"
        ry="7.5"
        fill="#FFFFFF"
        opacity="0.25"
        transform="rotate(-25 23 30)"
      />
      <defs>
        <radialGradient id={gradientId} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
      </defs>
    </svg>
  );
}
