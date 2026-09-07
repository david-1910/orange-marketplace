import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconCart = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="9" cy="21" r="1.5" />
    <circle cx="19" cy="21" r="1.5" />
    <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6" />
  </IconBase>
);
