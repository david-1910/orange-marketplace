import { Marquee } from '@/shared/ui';

const FACTS = [
  'ДОСТАВКА ЗА 2 ЧАСА',
  '12 000 ТОВАРОВ',
  'СКИДКИ ДО 70%',
  'ОПЛАТА ПРИ ПОЛУЧЕНИИ',
  'ВОЗВРАТ 30 ДНЕЙ',
];

/**
 * Бегущая строка фактов вместо подзаголовка по центру.
 * Останавливается при наведении — можно дочитать.
 */
export function PosterTicker() {
  return (
    <Marquee
      speed={30}
      pauseOnHover
      className="border-y border-gray-900/10 py-3"
    >
      {FACTS.map((fact) => (
        <span
          key={fact}
          className="text-label flex items-center gap-6 pr-6 text-gray-900 uppercase"
        >
          {fact}
          <span aria-hidden className="text-xs">
            🍊
          </span>
        </span>
      ))}
    </Marquee>
  );
}
