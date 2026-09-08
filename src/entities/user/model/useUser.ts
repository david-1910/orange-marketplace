import { type UserActions, useUserStore } from './userStore';
import type { User } from './types';

/** Текущий пользователь или null, если это гость. */
export const useUser = (): User | null => useUserStore((state) => state.user);

/** Вошёл ли пользователь. Отдельный селектор, чтобы подписка была на boolean. */
export const useIsAuthorized = (): boolean =>
  useUserStore((state) => state.user !== null);

/** Экшены пользователя одной стабильной ссылкой. */
export const useUserActions = (): UserActions =>
  useUserStore((state) => state.actions);
