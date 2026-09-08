import { useEffect, useRef, type ReactNode } from 'react';

import { motion } from 'motion/react';

import { MOTION_TRANSITION } from '@/shared/config';
import { cn, useLockBodyScroll } from '@/shared/lib';

import { IconClose } from './icons/IconClose';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Скрыть заголовок визуально, оставив его для скринридера. */
  isTitleHidden?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Модальное окно на нативном `<dialog>` + showModal().
 *
 * Нативный элемент выбран не из экономии: он бесплатно даёт то, что
 * иначе пришлось бы писать руками и чинить годами — удержание фокуса
 * внутри окна, возврат фокуса на триггер при закрытии, закрытие по
 * Esc и inert для остальной страницы. Ролей и aria-modal руками
 * ставить не нужно, они у dialog встроенные.
 *
 * Прокрутка документа глушится: `<dialog>` сам её не блокирует, а под
 * окном остаётся живая страница. `data-lenis-prevent` нужен потому,
 * что в проекте стоит Lenis, и без него колесо внутри окна прокручивало
 * бы документ — та же проблема уже решалась в оверлее товара.
 *
 * Анимация только на появлении: закрыть `<dialog>` нужно вызовом
 * close(), и ждать окончания анимации выхода пришлось бы вручную,
 * рассинхронизируя состояние с DOM.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  isTitleHidden = false,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent
      // Esc у dialog отменяемый, поэтому состояние синхронизируем по
      // его собственному событию: иначе окно закрылось бы в DOM, а
      // isOpen остался true, и второй раз оно бы не открылось.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      // Клик по подложке: сам dialog занимает весь экран, поэтому
      // клик именно по нему (а не по внутренней панели) — это клик
      // мимо окна.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto max-h-svh w-full max-w-lg bg-transparent p-4 backdrop:bg-gray-900/40 backdrop:backdrop-blur-sm"
    >
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={MOTION_TRANSITION.ui}
          className={cn(
            'shadow-float relative flex flex-col gap-5 rounded-3xl bg-white p-6 sm:p-8',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <h2
              className={cn(
                'text-total text-gray-900',
                isTitleHidden && 'sr-only',
              )}
            >
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="hover:border-brand-500 hover:text-brand-600 grid size-10 shrink-0 place-items-center rounded-full border border-gray-900/10 text-gray-900 transition-colors"
            >
              <IconClose className="size-5" />
            </button>
          </div>

          {children}
        </motion.div>
      )}
    </dialog>
  );
}
