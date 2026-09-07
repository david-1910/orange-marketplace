/**
 * Контракт между элементами и кастомным курсором — data-атрибут.
 *
 * Через контекст это сделать нельзя: провайдер жил бы в widgets, а
 * подписи нужны кнопкам из shared/ui — получился бы импорт вверх по
 * слоям. Атрибут же не создаёт связи ни в одну сторону: элемент его
 * просто выставляет, курсор читает делегированием с document.
 */
export const CURSOR_LABEL_ATTRIBUTE = 'data-cursor-label';

/**
 * Пропсы подписи для курсора: <a {...cursorLabel('СМОТРЕТЬ')}>.
 */
export const cursorLabel = (
  label: string,
): Record<typeof CURSOR_LABEL_ATTRIBUTE, string> => ({
  [CURSOR_LABEL_ATTRIBUTE]: label,
});
