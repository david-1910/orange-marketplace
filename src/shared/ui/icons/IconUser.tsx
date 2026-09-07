import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconUser = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </IconBase>
);
