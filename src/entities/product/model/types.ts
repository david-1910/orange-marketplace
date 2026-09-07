export interface Category {
  id: string;
  title: string;
  /** Эмодзи-заглушка вместо изображения — так задано брифом. */
  emoji: string;
}

export interface Product {
  id: string;
  title: string;
  categoryId: string;
  /** Цена в сумах, целое число. Дробей в сумах не бывает. */
  price: number;
  /** Цена до скидки; отсутствует, если скидки нет. */
  oldPrice?: number;
  emoji: string;
  /**
   * Идентификатор фото на Unsplash (открытая лицензия).
   * Храним id, а не готовый URL: размер запрашивается под место
   * вывода, поэтому карточка не тянет фото для страницы товара.
   */
  photoId: string;
  /** Дополнительные фото для галереи на странице товара. */
  galleryPhotoIds?: string[];
  inStock: boolean;
  /** Оценка 0…5 с шагом 0.1. */
  rating: number;
  reviewsCount: number;
}
