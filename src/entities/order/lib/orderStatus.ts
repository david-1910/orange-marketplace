import type { OrderStatus } from '../model/types';

/**
 * Через сколько после оформления заказ переходит в следующую стадию.
 *
 * Демонстрационные величины: без бэкенда стадии двигать некому, но
 * увидеть переход «Собираем → Доставляется → Доставлен» нужно, не
 * ожидая суток.
 */
const ASSEMBLING_MS = 60_000;
const DELIVERING_MS = 180_000;

/**
 * Стадия заказа выводится из времени создания, а не хранится.
 *
 * Так статус остаётся верным после перезагрузки страницы: живой
 * setTimeout пришлось бы восстанавливать при каждом запуске и держать
 * в сторе рядом с самим заказом, где он неминуемо разъехался бы с
 * реальным временем.
 */
export const getOrderStatus = (
  createdAt: string,
  now: number = Date.now(),
): OrderStatus => {
  const elapsed = now - new Date(createdAt).getTime();

  if (elapsed < ASSEMBLING_MS) return 'assembling';
  if (elapsed < DELIVERING_MS) return 'delivering';

  return 'delivered';
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  assembling: 'Собираем',
  delivering: 'Доставляется',
  delivered: 'Доставлен',
};

/** Порядок стадий — для полосы прогресса на странице заказа. */
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'assembling',
  'delivering',
  'delivered',
];

/** Через сколько миллисекунд статус сменится; null — уже финальный. */
export const getMsToNextStatus = (
  createdAt: string,
  now: number = Date.now(),
): number | null => {
  const elapsed = now - new Date(createdAt).getTime();

  if (elapsed < ASSEMBLING_MS) return ASSEMBLING_MS - elapsed;
  if (elapsed < DELIVERING_MS) return DELIVERING_MS - elapsed;

  return null;
};
