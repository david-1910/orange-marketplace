import { useState } from 'react';

import { useUserActions } from '@/entities/user';
import { Input } from '@/shared/ui';

export interface ProfileNameFieldProps {
  name: string;
}

/**
 * Имя получателя с правкой на месте.
 *
 * Черновик держится локально и записывается в стор только по
 * подтверждению: иначе имя в уже оформленных заказах и в поле
 * «Получатель» менялось бы на каждую букву.
 */
export function ProfileNameField({ name }: ProfileNameFieldProps) {
  const { setName } = useUserActions();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-label text-gray-400 uppercase">Имя</span>
          <span className="text-ui text-gray-900">{name}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setDraft(name);
            setIsEditing(true);
          }}
          className="text-ui hover:text-brand-600 text-gray-500 transition-colors"
        >
          Изменить
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const trimmed = draft.trim();
        // Пустое имя не сохраняем: оно ушло бы в поле «Получатель»
        // следующего заказа и осталось бы там навсегда.
        if (!trimmed) return;

        setName(trimmed);
        setIsEditing(false);
      }}
      className="flex items-end gap-2"
    >
      <Input
        label="Имя"
        value={draft}
        autoFocus
        maxLength={60}
        onChange={(event) => setDraft(event.target.value)}
      />

      <button
        type="submit"
        className="text-label hover:bg-brand-500 h-10 shrink-0 rounded-full bg-gray-900 px-4 text-white uppercase transition-colors"
      >
        Сохранить
      </button>

      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="text-label hover:border-brand-500 h-10 shrink-0 rounded-full border border-gray-900/10 px-4 text-gray-500 uppercase transition-colors"
      >
        Отмена
      </button>
    </form>
  );
}
