import type { Category } from '../model/types';

/**
 * Фикстуры лежат в api, а не в model: это подменённый источник
 * данных, то есть та же ответственность, что и у запроса. Когда
 * появится бэкенд, каталог api меняется целиком, model не трогаем.
 *
 * Список обязан покрывать все categoryId из моков товаров: категории,
 * которой здесь нет, не существует ни для пилюль каталога, ни для
 * фильтра избранного — товары в ней становятся недостижимы. Эмодзи
 * берём те же, что стоят у товаров этой категории.
 */
export const MOCK_CATEGORIES: Category[] = [
  { id: 'electronics', title: 'Электроника', emoji: '📱' },
  { id: 'audio', title: 'Аудио', emoji: '🎧' },
  { id: 'apparel', title: 'Одежда', emoji: '👕' },
  { id: 'shoes', title: 'Обувь', emoji: '👟' },
  { id: 'watches', title: 'Часы', emoji: '⌚' },
  { id: 'beauty', title: 'Красота', emoji: '💄' },
  { id: 'appliances', title: 'Техника', emoji: '🔌' },
  { id: 'home', title: 'Для дома', emoji: '🪴' },
  { id: 'gaming', title: 'Игры', emoji: '🎮' },
  { id: 'sport', title: 'Спорт', emoji: '🏀' },
];
