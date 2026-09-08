import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Ключ хранилища объявлен здесь, а не в общем реестре в shared:
 * «favorite» — доменное слово, а shared о домене знать не должен.
 * По той же причине ссылка на отфильтрованный каталог живёт в
 * entities/category, а не в shared/config.
 */
const STORAGE_KEY = 'orange-favorites';

export interface FavoriteActions {
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

interface FavoriteState {
  ids: string[];
  /**
   * Экшены собраны одним вложенным объектом, а не разложены по
   * корню стора. Причина в zustand 5: он убрал автоматическое
   * shallow-сравнение, поэтому селектор вида
   * `(s) => ({ toggle: s.toggle })` возвращал бы новую ссылку на
   * каждый рендер и компонент перерисовывался бы от любого
   * изменения стора. Один вложенный объект — одна стабильная
   * ссылка, и useShallow не нужен.
   */
  actions: FavoriteActions;
}

/**
 * Избранное — состояние, которым владеет клиент, поэтому оно живёт в
 * zustand, а не в react-query. Граница между двумя механизмами
 * держится буквально: react-query — только данные каталога «с
 * сервера» (товары, категории), zustand — корзина, избранное, заказы,
 * пользователь. Смешивать их в одном слайсе нельзя, иначе через
 * несколько сущностей будет непонятно, где источник правды.
 *
 * Хранятся только идентификаторы: сущность «избранное» не знает о
 * сущности «товар» и не имеет права её импортировать. Данные товаров
 * по этим id подтягивает тот, кто рисует, — виджет или страница.
 *
 * Стор наружу из слайса не экспортируется: снаружи доступны только
 * хуки из публичного API, поэтому подписка всегда идёт через селектор.
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      ids: [],

      actions: {
        toggle: (productId) =>
          set((state) => ({
            ids: state.ids.includes(productId)
              ? state.ids.filter((id) => id !== productId)
              : // Новое добавление встаёт первым: на странице
                // избранного сверху оказывается то, что положили
                // последним.
                [productId, ...state.ids],
          })),

        remove: (productId) =>
          set((state) => ({
            ids: state.ids.filter((id) => id !== productId),
          })),

        clear: () => set({ ids: [] }),
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Пишем только сами идентификаторы: экшены в localStorage
      // не нужны, а лишние поля пришлось бы мигрировать.
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
