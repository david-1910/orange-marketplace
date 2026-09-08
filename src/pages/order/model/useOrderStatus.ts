import { useEffect, useState } from 'react';

import {
  type OrderStatus,
  getMsToNextStatus,
  getOrderStatus,
} from '@/entities/order';

/**
 * Текущая стадия заказа, обновляющаяся сама.
 *
 * Стадия вычисляется из времени создания, поэтому после перезагрузки
 * она сразу верная. Но пока страница открыта, время идёт, а рендера
 * никто не вызывает — отсюда таймер. Он заведён ровно на момент
 * следующего перехода, а не тикает каждую секунду: перерисовывать
 * страницу 60 раз в минуту, чтобы поменять надпись дважды, незачем.
 */
export const useOrderStatus = (createdAt: string): OrderStatus => {
  const [status, setStatus] = useState(() => getOrderStatus(createdAt));

  useEffect(() => {
    const msToNext = getMsToNextStatus(createdAt);
    if (msToNext === null) return;

    const timer = window.setTimeout(() => {
      setStatus(getOrderStatus(createdAt));
    }, msToNext);

    return () => window.clearTimeout(timer);
    // status в зависимостях намеренно: после каждого перехода эффект
    // перезапускается и ставит таймер на следующую стадию.
  }, [createdAt, status]);

  return status;
};
