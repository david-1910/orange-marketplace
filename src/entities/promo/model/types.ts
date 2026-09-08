export interface Promo {
  code: string;
  /** Скидка в процентах от суммы товаров. */
  percent: number;
  /** Больше этой суммы промокод не снимает. */
  maxDiscount: number;
  /** Короткое пояснение для баннера. */
  hint: string;
}
