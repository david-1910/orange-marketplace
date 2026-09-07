import { Link } from 'react-router';

import { ROUTES, cursorLabel } from '@/shared/config';
import {
  CircularText,
  ClickSpark,
  IconArrowUpRight,
  Magnet,
} from '@/shared/ui';

/**
 * Слово повторено четыре раза, чтобы замкнуть окружность:
 * при радиусе 38 единиц viewBox её длина ≈ 239 единиц, а одно
 * «КУПИТЬ · » занимает около 60. С меньшим числом повторов
 * остаётся пустая дуга и круг выглядит недоделанным.
 */
const CIRCLE_TEXT = 'КУПИТЬ · '.repeat(4);

/**
 * Единственный акцент действия на первом экране: чёрный круг с
 * текстом по окружности вместо привычной пары кнопок.
 *
 * Притягивается к курсору, при клике сыпет искрами и уводит
 * в каталог.
 */
export function BuyMagnet() {
  return (
    <Magnet radius={180} strength={0.3}>
      <ClickSpark count={12} distance={64}>
        <Link
          to={ROUTES.catalog}
          aria-label="Перейти в каталог"
          {...cursorLabel('в каталог')}
          className="hover:bg-brand-500 relative flex size-28 items-center justify-center rounded-full bg-gray-900 text-white transition-colors"
        >
          <CircularText text={CIRCLE_TEXT} className="absolute inset-0" />
          <IconArrowUpRight className="size-7" />
        </Link>
      </ClickSpark>
    </Magnet>
  );
}
