/**
 * Маска узбекского номера: +998-(91)-123-45-67.
 *
 * Реализована как чистая функция от строки, а не набором обработчиков
 * клавиш: формат жёсткий, и его удобнее проверять на входных данных,
 * чем воспроизводить события клавиатуры. В onChange остаётся один
 * вызов.
 *
 * Приём такой: из введённой строки выбрасывается всё, кроме цифр,
 * отбрасывается код страны, а остальные цифры раскладываются по
 * группам заново. Поэтому префикс нельзя стереть, а курсор не
 * ломается о разделители: они не хранятся, а рисуются каждый раз.
 */

/** Код страны, который не убирается из поля. */
const COUNTRY_CODE = '998';

export const PHONE_PREFIX = `+${COUNTRY_CODE}-(`;

/** Размеры групп после кода страны: (91)-123-45-67. */
const GROUPS = [2, 3, 2, 2] as const;

/** Сколько цифр нужно ввести после кода страны. */
export const PHONE_DIGITS = GROUPS.reduce((sum, size) => sum + size, 0);

/** Готовый номер, к которому маска стремится, — для placeholder. */
export const PHONE_PLACEHOLDER = '+998-(__)-___-__-__';

/**
 * Цифры номера без кода страны, не больше девяти.
 *
 * Код страны отбрасывается, только если строка с него начинается:
 * иначе номер, начинающийся на 99 (например 99 123 45 67), потерял бы
 * первые цифры.
 */
export const extractPhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  const withoutCode = digits.startsWith(COUNTRY_CODE)
    ? digits.slice(COUNTRY_CODE.length)
    : digits;

  return withoutCode.slice(0, PHONE_DIGITS);
};

/** Собрать «+998-(91)-123-45-67» из введённого как угодно номера. */
export const formatPhone = (value: string): string => {
  const digits = extractPhoneDigits(value);

  if (!digits) return PHONE_PREFIX;

  let rest = digits;
  const parts: string[] = [];

  for (const size of GROUPS) {
    if (!rest) break;
    parts.push(rest.slice(0, size));
    rest = rest.slice(size);
  }

  const [operator, ...tail] = parts;

  // Закрывающая скобка появляется только когда код оператора набран
  // целиком: иначе она мешала бы дописать вторую цифру.
  const head =
    operator.length === GROUPS[0]
      ? `${PHONE_PREFIX}${operator})`
      : `${PHONE_PREFIX}${operator}`;

  return tail.length ? `${head}-${tail.join('-')}` : head;
};

/** Номер набран полностью. */
export const isPhoneComplete = (value: string): boolean =>
  extractPhoneDigits(value).length === PHONE_DIGITS;
