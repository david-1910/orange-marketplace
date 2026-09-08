import { useCallback } from 'react';

import { useCartActions } from '@/entities/cart';
import { useFavoriteActions } from '@/entities/favorite';
import { useUserActions } from '@/entities/user';
import { notify } from '@/shared/lib';

/**
 * Выход из аккаунта: пользователь, корзина и избранное разом.
 *
 * Отдельная фича, потому что чистить нужно три сущности, а сущности
 * друг о друге не знают — `entities/user` не имеет права дёргать
 * корзину. Раньше страница профиля вызывала только `signOut`, и после
 * выхода в шапке оставались чужие счётчики: корзина и избранное живут
 * в своих сторах с persist и сами не сбрасываются.
 *
 * Заказы намеренно остаются: это документы об уже оплаченных покупках,
 * и удалять их при выходе значило бы терять данные, которые человек
 * может ждать. Пока бэкенда нет, история привязана к браузеру, а не к
 * номеру телефона.
 */
export const useSignOut = (): (() => void) => {
  const { signOut } = useUserActions();
  const { clear: clearCart } = useCartActions();
  const { clear: clearFavorites } = useFavoriteActions();

  return useCallback(() => {
    signOut();
    clearCart();
    clearFavorites();

    notify.info('Вы вышли — корзина и избранное очищены');
  }, [signOut, clearCart, clearFavorites]);
};
