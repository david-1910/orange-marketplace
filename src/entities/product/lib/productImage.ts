const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

/**
 * Квадратный кроп — для карточек в сетке и миниатюр.
 *
 * Кроп делает сам Unsplash (fit=crop), поэтому сетка остаётся
 * ровной независимо от пропорций исходного снимка.
 */
export const buildProductImage = (photoId: string, size: number): string =>
  `${UNSPLASH_BASE}${photoId}?w=${size}&h=${size}&fit=crop&q=80`;

/**
 * Фото целиком, в своих пропорциях — для галереи на странице товара.
 *
 * Отдельная функция, а не флаг: у кропнутой картинки в URL заданы
 * и высота, и fit=crop, и именно из-за них товар обрезался. Здесь
 * задаётся только ширина, высоту Unsplash считает сам.
 */
export const buildProductPhoto = (photoId: string, width: number): string =>
  `${UNSPLASH_BASE}${photoId}?w=${width}&q=80`;
