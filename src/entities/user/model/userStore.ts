import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from './types';

/** Доменное слово в ключе, поэтому он живёт в слайсе, а не в shared. */
const STORAGE_KEY = 'orange-user';

export interface UserActions {
  /** Вход по телефону. Пока без кода подтверждения: бэкенда нет. */
  signIn: (phone: string) => void;
  /** Поменять имя получателя, не выходя из аккаунта. */
  setName: (name: string) => void;
  signOut: () => void;
}

interface UserState {
  /** null — гость. */
  user: User | null;
  actions: UserActions;
}

/** Имя по умолчанию, пока человек не назвался сам. */
const DEFAULT_NAME = 'Покупатель';

/**
 * Текущий пользователь.
 *
 * Отдельного слайса `entities/session` нет намеренно: без токенов и
 * бэкенда он состоял бы из одного булева поля, выведенного из этого
 * же стора. `isAuthorized` — это просто `user !== null`.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      actions: {
        signIn: (phone) =>
          set((state) => ({
            // Имя сохраняем при повторном входе с тем же номером:
            // человек уже представился, спрашивать снова незачем.
            user: {
              phone,
              name:
                state.user?.phone === phone ? state.user.name : DEFAULT_NAME,
            },
          })),

        setName: (name) =>
          set((state) =>
            state.user ? { user: { ...state.user, name } } : state,
          ),

        signOut: () => set({ user: null }),
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
