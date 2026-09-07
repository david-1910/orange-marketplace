import { IconBase } from './IconBase';
import type { IconProps } from './IconBase';

export const IconTruck = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 6.5h11v10H2z" />
    <path d="M13 10h4l3 3v3.5h-7z" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </IconBase>
);
