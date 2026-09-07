import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconCardPay = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19" />
    <path d="M6 15h4" />
  </IconBase>
);
