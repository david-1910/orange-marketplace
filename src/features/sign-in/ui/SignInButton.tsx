import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { SignInModal } from './SignInModal';

/**
 * primary — крупная кнопка основного действия (пустой профиль,
 * блок получателя в оформлении). icon — круглый значок в шапке.
 */
export type SignInButtonVariant = 'primary' | 'icon';

export interface SignInButtonProps {
  children: ReactNode;
  variant?: SignInButtonVariant;
  /** Что сделать после успешного входа. */
  onSuccess?: () => void;
  className?: string;
}

/**
 * Вид задаётся вариантом, а не переопределением классов снаружи.
 *
 * Так и было сделано сначала — шапка передавала `bg-transparent`
 * поверх базовых классов. Но у базовых был ещё и `hover:bg-brand-500`,
 * а tailwind-merge считает обычный и hover-вариант разными свойствами
 * и не гасит один другим. В результате значок аккаунта при наведении
 * заливался оранжевым целиком, в отличие от соседних иконок.
 */
const VARIANTS: Record<SignInButtonVariant, string> = {
  primary:
    'text-label hover:bg-brand-500 flex h-14 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 text-white uppercase transition-colors',
  icon: 'hover:border-brand-500 hover:text-brand-600 grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900 transition-colors',
};

/**
 * Кнопка, открывающая модалку входа.
 *
 * Состояние открытия держит здесь, а не у вызывающего: место входа не
 * одно (оформление заказа, хедер, пустой профиль), и каждому из них
 * незачем объявлять свой useState и рендерить свою модалку.
 */
export function SignInButton({
  children,
  variant = 'primary',
  onSuccess,
  className,
}: SignInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(VARIANTS[variant], className)}
      >
        {children}
      </button>

      <SignInModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...(onSuccess ? { onSuccess } : {})}
      />
    </>
  );
}
