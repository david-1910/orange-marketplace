import { cn } from '@/shared/lib';

import { LogoMark } from './LogoMark';

export type LogoTone = 'dark' | 'light';

export interface LogoFullProps {
  tone?: LogoTone;
  className?: string;
}

const WORDMARK_TONES: Record<LogoTone, string> = {
  dark: 'text-gray-900',
  light: 'text-white',
};

const DOMAIN_TONES: Record<LogoTone, string> = {
  dark: 'text-brand-500',
  light: 'text-accent-400',
};

/**
 * Полный логотип: знак + текстовая часть.
 * Текст — обычный HTML, а не <text> внутри SVG: так он берёт
 * подключённый Montserrat, доступен скринридерам и не даёт
 * подмены шрифта до загрузки файла.
 */
export function LogoFull({ tone = 'dark', className }: LogoFullProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="size-9 shrink-0" />
      <span
        className={cn(
          'text-2xl font-extrabold tracking-tight',
          WORDMARK_TONES[tone],
        )}
      >
        Orange
        <span className={DOMAIN_TONES[tone]}>.uz</span>
      </span>
    </span>
  );
}
