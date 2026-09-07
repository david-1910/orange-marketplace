import { IconBase } from './icon-base';
import type { IconProps } from './types';

export const IconCart = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="9" cy="21" r="1.5" />
    <circle cx="19" cy="21" r="1.5" />
    <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6" />
  </IconBase>
);

export const IconHeart = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5Z" />
  </IconBase>
);

export const IconStar = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
  </IconBase>
);

export const IconTag = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4.8a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
  </IconBase>
);

export const IconTruck = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 6.5h11v10H2z" />
    <path d="M13 10h4l3 3v3.5h-7z" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </IconBase>
);

export const IconCardPay = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19" />
    <path d="M6 15h4" />
  </IconBase>
);
