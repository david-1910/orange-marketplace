import type { IconProps } from './IconBase';

export const IconOrange = (props: IconProps) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    focusable={false}
    {...props}
  >
    <circle cx="12" cy="14" r="8" fill="#FF6B35" />
    <ellipse
      cx="9"
      cy="11"
      rx="1.8"
      ry="2.8"
      fill="#fff"
      opacity="0.3"
      transform="rotate(-25 9 11)"
    />
    <path
      d="M12 6c0 0 2.5-2.5 5-1.2s1.2 3.7 0 3.7-3.5-1.2-5-2.5Z"
      fill="#10B981"
    />
  </svg>
);
