import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { IconArrowUpRight } from './icons/IconArrowUpRight';

/**
 * round — круглая кнопка поверх содержимого, для картинок.
 * slim — узкая плоская полоса по краю: она почти не заходит на
 * содержимое, поэтому не закрывает текст.
 */
export type ScrollSwiperArrow = 'round' | 'slim';

export interface ScrollSwiperProps {
  children: ReactNode;
  /** Ширина одного слайда, например `w-full` или `w-80`. */
  slideClassName?: string;
  /** Показать точки-индикаторы под треком. */
  hasDots?: boolean;
  /** Вид стрелок. Для текстовых слайдов нужен slim. */
  arrowVariant?: ScrollSwiperArrow;
  /** Подпись области для скринридера. */
  ariaLabel: string;
  className?: string;
  trackClassName?: string;
}

/**
 * Свайпер на нативной прокрутке со стрелками и полосой прокрутки.
 *
 * Общий примитив: им пользуются и галерея товара, и лента отзывов.
 * Держать две почти одинаковые карусели в разных слайсах значило бы
 * править прокрутку, стрелки и снаппинг дважды.
 *
 * Основа — `overflow-x: auto` со `scroll-snap`, а не transform-слайдер
 * и не библиотека. Тогда свайп пальцем, инерция, колесо и перетаскивание
 * полосы работают сами; слайды остаются в DOM, поэтому по ним ходит
 * Tab, а скринридер читает их как обычный список.
 *
 * `data-lenis-prevent` обязателен: в проекте стоит Lenis, который
 * перехватывает колесо на документе, и без атрибута прокрутка внутри
 * трека не работала бы вовсе.
 *
 * Стрелки и точки — отражение позиции прокрутки, а не отдельный
 * источник правды: активный слайд и доступность стрелок считаются из
 * scrollLeft, поэтому они не могут разойтись с тем, что видно.
 */
export function ScrollSwiper({
  children,
  slideClassName = 'w-full',
  hasDots = false,
  arrowVariant = 'round',
  ariaLabel,
  className,
  trackClassName,
}: ScrollSwiperProps) {
  const slides = Children.toArray(children);

  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, max: 0, slideWidth: 1 });

  const measure = () => {
    const track = trackRef.current;
    if (!track) return;

    const firstSlide = track.firstElementChild;

    setScroll({
      left: track.scrollLeft,
      max: track.scrollWidth - track.clientWidth,
      // Ширину берём у самого слайда, а не у трека: слайды бывают
      // уже контейнера, и тогда деление на ширину трека давало бы
      // неверный индекс.
      slideWidth: firstSlide?.clientWidth || track.clientWidth || 1,
    });
  };

  /**
   * Замер через ResizeObserver, а не только по событию прокрутки.
   *
   * Это исправление настоящей ошибки: пока размеры обновлялись лишь
   * в onScroll, при первом рендере max оставался нулём, обе стрелки
   * получали disabled — и прокрутить трек было нечем. Наблюдатель же
   * срабатывает сразу после подписки, поэтому размеры известны до
   * первого взаимодействия, и он же ловит смену ширины окна.
   *
   * Подписка на внешнюю систему — законный повод для эффекта, в
   * отличие от синхронного setState в его теле.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
    // slides.length в зависимостях: при смене числа слайдов меняется
    // и предел прокрутки.
  }, [slides.length]);

  // Запас в один пиксель: браузеры отдают дробный scrollLeft, и на
  // краю сравнение «равно» не срабатывает.
  const canPrev = scroll.left > 1;
  const canNext = scroll.left < scroll.max - 1;

  const activeIndex = Math.round(scroll.left / scroll.slideWidth);

  const scrollBy = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * scroll.slideWidth,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    trackRef.current?.scrollTo({
      left: index * scroll.slideWidth,
      behavior: 'smooth',
    });
  };

  /**
   * disabled:pointer-events-none обязателен, а не украшение.
   * Неактивная стрелка спрятана через opacity-0, но невидимый
   * элемент остаётся в потоке и продолжает ловить курсор — а
   * глобальное правило в базовых стилях даёт отключённой кнопке
   * `cursor: not-allowed`. Получалось, что над пустым краем блока
   * курсор показывал запрет на действие, которого там нет.
   */
  const ARROW_BASE =
    'grid place-items-center border border-gray-900/10 transition-colors disabled:pointer-events-none disabled:opacity-0';

  const ARROWS: Record<ScrollSwiperArrow, string> = {
    round:
      'size-10 rounded-full bg-white/90 text-gray-900 backdrop-blur-md hover:border-brand-500 hover:text-brand-600',
    // Узкая полоса: 24px против 40px у круга. Такая стрелка почти не
    // наезжает на текст отзыва, а раньше круглая накрывала последние
    // слова.
    slim: 'h-16 w-6 bg-white/85 text-gray-400 backdrop-blur-sm hover:border-brand-400 hover:text-brand-600',
  };

  const ARROW = cn(ARROW_BASE, ARROWS[arrowVariant]);

  const EDGE = arrowVariant === 'slim' ? '' : 'pl-2';
  const EDGE_RIGHT = arrowVariant === 'slim' ? '' : 'pr-2';

  const ICON = arrowVariant === 'slim' ? 'size-4' : 'size-5';

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        onScroll={measure}
        data-lenis-prevent
        role="group"
        aria-label={ariaLabel}
        className={cn(
          'flex snap-x snap-mandatory scrollbar-thin [scrollbar-color:var(--color-brand-300)_transparent] overflow-x-auto overflow-y-hidden',
          trackClassName,
        )}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn('shrink-0 snap-start', slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Стрелки поверх трека по краям. disabled прячет их
              полностью, а не приглушает: неактивная стрелка на краю
              только обманывает ожидание. */}
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 flex items-center',
              EDGE,
            )}
          >
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Назад"
              className={cn(
                ARROW,
                'pointer-events-auto',
                // Скругление с наружной стороны — той, что смотрит к
                // краю блока. Внутренняя сторона остаётся прямой,
                // поэтому полоса читается как приклеенная к краю, а
                // не как отдельная плашка посреди карточки.
                arrowVariant === 'slim' && 'rounded-l-lg',
              )}
            >
              {/* Поворачиваем иконку, а не кнопку. Поворот кнопки
                  незаметен на круге, но узкую полосу он превращает в
                  ромб: габариты вырастают с 24×64 до 62×62, и стрелка
                  начинает налезать на текст сильнее, чем нужно. */}
              <IconArrowUpRight className={cn(ICON, '-rotate-135')} />
            </button>
          </div>

          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 flex items-center',
              EDGE_RIGHT,
            )}
          >
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Вперёд"
              className={cn(
                ARROW,
                'pointer-events-auto',
                arrowVariant === 'slim' && 'rounded-r-lg',
              )}
            >
              <IconArrowUpRight className={cn(ICON, 'rotate-45')} />
            </button>
          </div>
        </>
      )}

      {hasDots && slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Слайд ${index + 1} из ${slides.length}`}
              aria-current={index === activeIndex}
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === activeIndex
                  ? 'bg-brand-500 w-8'
                  : 'w-3 bg-gray-900/15 hover:bg-gray-900/30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
