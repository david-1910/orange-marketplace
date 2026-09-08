import { cn } from '@/shared/lib';
import { Input, Modal } from '@/shared/ui';

import { PHONE_PLACEHOLDER } from '../lib/phoneMask';
import { useSignInForm } from '../model/useSignInForm';

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Что сделать после успешного входа — например увести на оформление. */
  onSuccess?: () => void;
}

/**
 * Вход по номеру телефона в модальном окне.
 *
 * Кода из СМС нет: бэкенда тоже нет, и экран ввода кода без проверки
 * был бы декорацией, которая делает вид, что что-то подтверждает.
 * Когда появится сервер, второй шаг встанет сюда же, а форма и её
 * модель не изменятся.
 */
export function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const { phone, isComplete, error, setPhone, submit, reset } = useSignInForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Вход">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!submit()) return;

          reset();
          onSuccess?.();
          onClose();
        }}
        className="flex flex-col gap-5"
      >
        <p className="text-ui text-gray-500">
          Введите номер телефона — по нему сохранятся заказы и адреса.
        </p>

        <Input
          label="Номер телефона"
          // tel, а не text: на телефоне открывается цифровая
          // клавиатура, а не буквенная.
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          autoFocus
          value={phone}
          placeholder={PHONE_PLACEHOLDER}
          onChange={(event) => setPhone(event.target.value)}
          {...(error ? { error } : {})}
          className="text-total tabular-nums"
        />

        {/* Кнопка не помечается aria-disabled, хотя номер может быть
            неполным: по нажатию она обязана объяснить, чего не хватает.
            Объявить её отключённой и при этом ожидать от неё
            сообщения — противоречие: вспомогательные технологии
            (и автоматизация) просто не дадут по ней нажать.
            Незавершённость показываем цветом, а причину — текстом
            ошибки под полем. */}
        <button
          type="submit"
          className={cn(
            'text-label flex h-14 items-center justify-center rounded-full uppercase transition-colors',
            isComplete
              ? 'hover:bg-brand-500 bg-gray-900 text-white'
              : 'bg-gray-900/40 text-white',
          )}
        >
          Войти
        </button>
      </form>
    </Modal>
  );
}
