export type CardVariant = 'default' | 'hover' | 'gradient';

export const CARD_BASE = 'transition';

export const CARD_VARIANTS: Record<CardVariant, string> = {
  default: 'rounded-2xl border border-gray-100 bg-white p-6 shadow-soft',
  hover:
    'rounded-2xl border border-gray-100 bg-white p-6 shadow-soft hover:-translate-y-1 hover:shadow-lifted',
  gradient:
    'rounded-3xl bg-linear-135 from-brand-500 to-accent-400 p-8 text-white shadow-float',
};
