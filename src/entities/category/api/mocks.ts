import type { Category } from '../model/types';

/**
 * Фикстуры лежат в api, а не в model: это подменённый источник
 * данных, то есть та же ответственность, что и у запроса. Когда
 * появится бэкенд, каталог api меняется целиком, model не трогаем.
 */
export const MOCK_CATEGORIES: Category[] = [
  { id: 'electronics', title: 'Электроника', emoji: '📱' },
  { id: 'audio', title: 'Аудио', emoji: '🎧' },
  { id: 'shoes', title: 'Обувь', emoji: '👟' },
  { id: 'watches', title: 'Часы', emoji: '⌚' },
  { id: 'home', title: 'Для дома', emoji: '🪴' },
  { id: 'sport', title: 'Спорт', emoji: '🏀' },
];
