import { Link } from 'react-router';

import { useUser } from '@/entities/user';
import { SignInButton } from '@/features/sign-in';
import { ROUTES } from '@/shared/config';
import { IconUser } from '@/shared/ui';

/**
 * Первая буква имени для значка аккаунта.
 *
 * Если имя пустое или начинается с пробела, буквы не будет — тогда
 * показывается обычная иконка, а не пустой оранжевый круг.
 */
const getInitial = (name: string): string | null =>
  name.trim().charAt(0).toUpperCase() || null;

/**
 * Значок аккаунта в шапке.
 *
 * Состояния различаются намеренно и заметно:
 *
 * - гость видит контурный значок, такой же как поиск, избранное и
 *   корзина, — это приглашение войти, а не признак чего-либо;
 * - вошедший видит залитый оранжевым круг с первой буквой своего
 *   имени. Заливка здесь и есть знак «вы вошли»: среди четырёх
 *   одинаковых контурных кружков заполненный читается сразу, а буква
 *   отвечает на следующий вопрос — под кем именно.
 *
 * Раньше оба состояния выглядели одинаково, и понять, вошёл ты или
 * нет, можно было только заглянув в профиль.
 */
export function HeaderAccount() {
  const user = useUser();

  if (user) {
    const initial = getInitial(user.name);

    return (
      <Link
        to={ROUTES.profile}
        aria-label={`Профиль: ${user.name}`}
        title={user.name}
        className="bg-brand-500 hover:bg-brand-600 shadow-soft grid size-11 place-items-center rounded-full text-white transition-colors"
      >
        {initial ? (
          <span aria-hidden className="text-ui font-semibold">
            {initial}
          </span>
        ) : (
          <IconUser className="size-5" />
        )}
      </Link>
    );
  }

  return (
    // Вариант icon, а не подгонка классами снаружи: у крупной кнопки
    // есть свои hover-стили, и погасить их через className не выходит.
    <SignInButton variant="icon">
      <IconUser className="size-5" />
      <span className="sr-only">Войти</span>
    </SignInButton>
  );
}
