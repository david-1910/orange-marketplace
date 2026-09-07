import { Noise, SplitText } from '@/shared/ui';

import { BuyMagnet } from './BuyMagnet';
import { PosterOrange } from './PosterOrange';
import { PosterStat } from './PosterStat';
import { PosterTicker } from './PosterTicker';

const STATS = [
  { value: '12 000', label: 'товаров в каталоге' },
  { value: '2 часа', label: 'доставка по городу' },
  { value: '500+', label: 'брендов' },
];

/**
 * Первый экран: слово ORANGE одной строкой, где «O» — живой
 * апельсин, под словом одна группа фактов, кнопка покупки в правом
 * нижнем углу.
 *
 * Слово набрано в одну строку, поэтому размер ограничен и по vw,
 * и по vh: пяти буквам нужно вдвое больше ширины, чем прежним трём,
 * а высота полосы всего 65vh.
 *
 * Для машин слово идёт отдельным sr-only заголовком: визуальная
 * часть разрезана на апельсин и «RANGE», и без этого h1 читался бы
 * как «RANGE».
 */
export function HeroPoster() {
  return (
    <section className="bg-brand-50 relative flex min-h-[65svh] flex-col overflow-hidden">
      <Noise opacity={0.06} />

      <h1 className="sr-only">Orange — маркетплейс Узбекистана</h1>

      <div className="relative flex flex-1 flex-col justify-center px-4 pt-24 pb-8 sm:px-8">
        <p
          aria-hidden
          className="text-poster flex items-center text-gray-900 uppercase"
        >
          <PosterOrange />
          <SplitText text="RANGE" stagger={0.04} />
        </p>

        {/* Все факты одной группой под словом, а не по углам */}
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
          {STATS.map((stat, index) => (
            <PosterStat
              key={stat.value}
              value={stat.value}
              label={stat.label}
              delay={0.4 + index * 0.1}
            />
          ))}
        </div>

        <div className="absolute right-4 bottom-6 sm:right-8 sm:bottom-8">
          <BuyMagnet />
        </div>
      </div>

      <PosterTicker />
    </section>
  );
}
