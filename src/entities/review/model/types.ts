export interface Review {
  id: string;
  author: string;
  /** Оценка 1…5, целая: половинок в отзывах покупатели не ставят. */
  rating: number;
  text: string;
  /** ISO-строка. */
  createdAt: string;
  /** Отметка «покупка подтверждена». */
  isVerified: boolean;
}
