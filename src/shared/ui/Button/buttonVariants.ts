export type ButtonVariant =
  'primary' | 'outline' | 'ghost' | 'success' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-95 disabled:pointer-events-none disabled:opacity-50';

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white shadow-glow hover:bg-brand-600',
  outline:
    'border border-gray-200 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-600',
  ghost: 'font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600',
  success: 'bg-success-500 text-white shadow-sm hover:bg-success-600',
  danger: 'bg-error-500 text-white shadow-sm hover:bg-error-600',
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  icon: 'size-10 text-sm',
};
