import { Link } from 'react-router';

import { useIsAuthorized } from '@/entities/user';
import { SignInButton } from '@/features/sign-in';
import { ROUTES } from '@/shared/config';
import { IconUser } from '@/shared/ui';

/**
 * Иконка аккаунта в хедере.
 *
 * Гостю открывает модалку входа, вошедшему — ведёт в профиль.
 * Две роли в одном месте: значок в шапке всегда на одной позиции, и
 * переключение вида по состоянию честнее, чем показывать вошедшему
 * кнопку «Войти» или гостю ссылку на пустой профиль.
 *
 * Подписан на boolean, а не на самого пользователя: шапке нужно лишь
 * знать, вошёл он или нет, и от смены имени она перерисовываться не
 * должна.
 */
export function HeaderAccount() {
  const isAuthorized = useIsAuthorized();

  const CIRCLE =
    'hover:border-brand-500 hover:text-brand-600 grid size-11 place-items-center rounded-full border border-gray-900/10 text-gray-900 transition-colors';

  if (isAuthorized) {
    return (
      <Link to={ROUTES.profile} aria-label="Профиль" className={CIRCLE}>
        <IconUser className="size-5" />
      </Link>
    );
  }

  return (
    <SignInButton className={`${CIRCLE} h-11 bg-transparent px-0`}>
      <IconUser className="size-5" />
      <span className="sr-only">Войти</span>
    </SignInButton>
  );
}
