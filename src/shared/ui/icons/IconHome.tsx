import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconHome = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </IconBase>
);
