import { IconBase } from './icon-base';
import type { IconProps } from './types';

export const IconArrowUpRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </IconBase>
);

export const IconCheck = (props: IconProps) => (
  <IconBase strokeWidth={2.5} {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </IconBase>
);

export const IconClose = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />
  </IconBase>
);

export const IconChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

export const IconFilter = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
  </IconBase>
);
