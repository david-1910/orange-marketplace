import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconSearch = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);
