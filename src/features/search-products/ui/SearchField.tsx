import { useId, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router';

import { buildProductImage, formatPrice } from '@/entities/product';
import { MOTION_TRANSITION, ROUTES, buildPath } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconClose, IconSearch, Skeleton } from '@/shared/ui';

import { SEARCH_PARAM } from '../model/useProductSearch';
import { useSearchSuggestions } from '../model/useSearchSuggestions';

export interface SearchFieldProps {
  /** Шапка прилипла — подложка становится плотнее. */
  isFloating?: boolean;
}

/**
 * Поиск товаров: иконка раскрывается в поле с подсказками.
 *
 * Живёт в features, а не в widgets/header: это пользовательский
 * сценарий со своей логикой и запросом, а шапка — только место, где
 * он стоит. Раньше здесь была заглушка в виджете — поле, не
 * подключённое ни к чему.
 *
 * Разметка следует шаблону combobox: у поля role="combobox" со
 * ссылкой на список, у списка role="listbox", у элементов
 * role="option". Благодаря этому скринридер сообщает, что появились
 * подсказки, и читает выделенную стрелками — без aria такое поле для
 * него просто текстовый ввод, а стрелки «ничего не делают».
 *
 * Enter без выбранной подсказки уводит в каталог с запросом: людям
 * привычнее увидеть полную выдачу, чем шесть верхних совпадений.
 */
export function SearchField({ isFloating = false }: SearchFieldProps) {
  const navigate = useNavigate();

  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  // −1 — ничего не выделено, Enter отправляет запрос целиком.
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useSearchSuggestions(isOpen ? value : '');

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const goToCatalog = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    close();
    void navigate(
      `${ROUTES.catalog}?${SEARCH_PARAM}=${encodeURIComponent(trimmed)}`,
    );
  };

  const goToProduct = (productId: string) => {
    close();
    void navigate(buildPath(ROUTES.product, { id: productId }));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { items } = suggestions;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!items.length) return;

      // Курсор в поле не должен уезжать в начало и конец строки,
      // пока стрелки листают подсказки.
      event.preventDefault();

      const step = event.key === 'ArrowDown' ? 1 : -1;
      // Обход по кругу с заходом на −1: так стрелка вверх с первой
      // подсказки возвращает к «искать по запросу целиком».
      const next = activeIndex + step;
      setActiveIndex(next < -1 ? items.length - 1 : next % items.length);
      return;
    }

    if (event.key === 'Enter') {
      const active = items[activeIndex];

      if (active) goToProduct(active.id);
      else goToCatalog(value);
    }
  };

  const hasPanel =
    isOpen && (suggestions.isActive || suggestions.isLoading) && value.trim();

  return (
    <div className="relative">
      <motion.div
        layout
        transition={MOTION_TRANSITION.ui}
        className={cn(
          'flex h-11 items-center gap-2 rounded-full border border-gray-900/10 px-3',
          isFloating ? 'bg-white/80 backdrop-blur-xl' : 'bg-white/40',
        )}
      >
        <button
          type="button"
          aria-label={isOpen ? 'Закрыть поиск' : 'Открыть поиск'}
          aria-expanded={isOpen}
          onClick={() => {
            if (isOpen) {
              close();
              setValue('');
              return;
            }

            setIsOpen(true);
            // Фокус после раскрытия: поля в DOM ещё нет в момент клика.
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="grid size-6 place-items-center text-gray-900"
        >
          {isOpen ? (
            <IconClose className="size-5" />
          ) : (
            <IconSearch className="size-5" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.input
              ref={inputRef}
              type="search"
              placeholder="Искать товары"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={Boolean(hasPanel)}
              aria-controls={listId}
              aria-autocomplete="list"
              {...(suggestions.items[activeIndex]
                ? { 'aria-activedescendant': `${listId}-${activeIndex}` }
                : {})}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={MOTION_TRANSITION.ui}
              className="text-ui bg-transparent outline-none placeholder:text-gray-400"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {hasPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={MOTION_TRANSITION.micro}
            className="shadow-float absolute top-full right-0 z-40 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-900/5 bg-white"
          >
            {suggestions.isLoading && (
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-12 rounded-xl" />
                ))}
              </div>
            )}

            {suggestions.isEmpty && (
              <p className="text-ui p-4 text-gray-500">
                Ничего не нашлось. Попробуйте другое слово.
              </p>
            )}

            {suggestions.items.length > 0 && (
              <ul id={listId} role="listbox" aria-label="Подсказки поиска">
                {suggestions.items.map((product, index) => (
                  <li key={product.id} role="none">
                    <button
                      type="button"
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      // mousedown, а не click: клик приходит после
                      // потери фокуса полем, и панель успевала бы
                      // закрыться раньше выбора.
                      onMouseDown={(event) => {
                        event.preventDefault();
                        goToProduct(product.id);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                        index === activeIndex ? 'bg-brand-50' : 'bg-white',
                      )}
                    >
                      <span className="bg-brand-50 size-10 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={buildProductImage(product.photoId, 80)}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </span>

                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-ui truncate text-gray-900">
                          {product.title}
                        </span>
                        <span className="text-label text-gray-400 tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}

                <li role="none" className="border-t border-gray-900/5">
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      goToCatalog(value);
                    }}
                    className="text-label hover:text-brand-600 w-full px-3 py-3 text-left text-gray-500 uppercase transition-colors"
                  >
                    Показать все результаты
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
