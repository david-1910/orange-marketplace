export type BadgeTone =
  'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export const BADGE_BASE =
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold';

export const BADGE_TONES: Record<BadgeTone, string> = {
  brand: 'bg-brand-500 text-white',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  error: 'bg-error-100 text-error-600',
  info: 'bg-info-100 text-info-600',
  neutral: 'bg-gray-100 text-gray-600',
};
