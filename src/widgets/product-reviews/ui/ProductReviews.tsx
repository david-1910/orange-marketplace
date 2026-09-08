import { useReviews } from '@/entities/review';
import { cn } from '@/shared/lib';
import {
  Badge,
  ErrorState,
  IconCheck,
  IconStar,
  ScrollSwiper,
  Skeleton,
} from '@/shared/ui';

export interface ProductReviewsProps {
  productId: string;
  /** Средний рейтинг товара — он приходит из каталога, а не из отзывов. */
  rating: number;
  reviewsCount: number;
}

/** «8 сентября» — год не нужен, отзывы свежие. */
const formatDate = (createdAt: string): string =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
    new Date(createdAt),
  );

/** Пять звёзд, залитых до оценки. */
function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <IconStar
          key={index}
          fill="currentColor"
          className={cn(
            'size-3.5',
            index < value ? 'text-accent-500' : 'text-gray-200',
          )}
        />
      ))}
    </span>
  );
}

/**
 * Отзывы о товаре.
 *
 * Средний рейтинг берётся из самого товара, а не считается по этим
 * пяти отзывам: в каталоге он посчитан по всем отзывам, и пересчёт по
 * загруженной странице показал бы другое число рядом с тем же
 * товаром.
 *
 * Оценка каждого отзыва дублируется звёздами и текстом: звёзды
 * помечены aria-hidden, потому что на слух «звезда звезда звезда» —
 * это шум, а рядом стоит нормальная подпись.
 */
export function ProductReviews({
  productId,
  rating,
  reviewsCount,
}: ProductReviewsProps) {
  const { data: reviews, isLoading, isError, refetch } = useReviews(productId);

  return (
    <section aria-labelledby="reviews-title" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 id="reviews-title" className="text-total text-gray-900">
          Отзывы
        </h2>
        <span className="text-ui text-gray-400 tabular-nums">
          {rating} · {reviewsCount} отзывов
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={() => void refetch()} />}

      {reviews && (
        // Свайпер, а не столбик: отзывы стоят под галереей, в той же
        // колонке, и пять карточек столбиком отодвинули бы всё
        // остальное далеко вниз. Примитив общий с галереей, поэтому
        // прокрутка и стрелки ведут себя одинаково на обоих блоках.
        <ScrollSwiper
          ariaLabel="Отзывы о товаре"
          arrowVariant="slim"
          hasDots
          // Отступы слайда симметричные, а не только справа. Раньше
          // стоял один pr-3: справа от карточки получался зазор, и
          // стрелка вставала в него аккуратно, а слева зазора не было
          // — левая стрелка ложилась прямо на первую букву текста.
          // Теперь обе стрелки стоят в одинаковых промежутках.
          //
          // -mx-3 у самого свайпера гасит эти отступы снаружи, чтобы
          // карточки остались выровнены по заголовку блока.
          className="-mx-3"
          slideClassName="w-full px-3"
          trackClassName="pb-3"
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              // Боковые отступы больше вертикальных: стрелка заходит
              // на карточку примерно на 12px, и запас нужен всему
              // содержимому сразу — имени, дате и тексту. Дать его
              // одному абзацу значило бы сдвинуть текст относительно
              // имени автора.
              className="flex h-full flex-col gap-2 rounded-2xl border border-gray-900/5 bg-white px-7 py-4"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-ui font-medium text-gray-900">
                  {review.author}
                </span>

                <Stars value={review.rating} />
                <span className="text-label text-gray-400 tabular-nums">
                  {review.rating} из 5
                </span>

                <span className="text-label ml-auto text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {review.isVerified && (
                <Badge tone="success" className="flex w-fit items-center gap-1">
                  <IconCheck className="size-3" />
                  Покупка подтверждена
                </Badge>
              )}

              <p className="text-ui text-gray-600">{review.text}</p>
            </article>
          ))}
        </ScrollSwiper>
      )}
    </section>
  );
}
