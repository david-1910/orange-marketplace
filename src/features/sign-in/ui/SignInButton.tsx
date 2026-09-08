import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { SignInModal } from './SignInModal';

export interface SignInButtonProps {
  children: ReactNode;
  /** Что сделать после успешного входа. */
  onSuccess?: () => void;
  className?: string;
}

/**
 * Кнопка, открывающая модалку входа.
 *
 * Состояние открытия держит здесь, а не у вызывающего: место входа не
 * одно (оформление заказа, хедер, пустой профиль), и каждому из них
 * незачем объявлять свой useState и рендерить свою модалку.
 */
export function SignInButton({
  children,
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
        className={cn(
          'text-label hover:bg-brand-500 flex h-14 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 text-white uppercase transition-colors',
          className,
        )}
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
