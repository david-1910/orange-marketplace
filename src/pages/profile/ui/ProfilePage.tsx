import { Link } from 'react-router';

import { useOrdersByPhone } from '@/entities/order';
import { useUser } from '@/entities/user';
import { SignInButton } from '@/features/sign-in';
import { useSignOut } from '@/features/sign-out';
import { ROUTES } from '@/shared/config';
import {
  EmptyState,
  IconArrowUpRight,
  IconUser,
  LogoMonogram,
  SplitText,
} from '@/shared/ui';
import { OrderList } from '@/widgets/order-list';

import { ProfileNameField } from './ProfileNameField';

/**
 * Профиль: данные покупателя и история заказов.
 *
 * История отбирается по номеру телефона, на который оформлен заказ.
 * Без бэкенда заказы всё равно лежат в этом браузере, но показывать
 * их нужно только владельцу: иначе выход и вход под другим номером
 * открывали чужие покупки.
 */
export function ProfilePage() {
  const user = useUser();
  const signOut = useSignOut();
  // Только заказы этого номера: иначе после входа под другим
  // телефоном в истории оказывались чужие покупки.
  const orders = useOrdersByPhone(user?.phone);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-label text-gray-400 uppercase">05 — Профиль</span>
        <p aria-hidden className="text-display-sm text-gray-900 uppercase">
          <SplitText text="Профиль" by="word" stagger={0.06} />
        </p>
        <h1 className="sr-only">Профиль</h1>
      </div>

      {user ? (
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="flex flex-col gap-5 rounded-2xl border border-gray-900/5 bg-white p-6 lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="bg-brand-50 text-brand-600 grid size-12 shrink-0 place-items-center rounded-full">
                <IconUser className="size-6" />
              </span>
              <span className="flex flex-col">
                <span className="text-label text-gray-400 uppercase">
                  Телефон
                </span>
                <span className="text-ui text-gray-900 tabular-nums">
                  {user.phone}
                </span>
              </span>
            </div>

            <div className="border-t border-gray-900/10 pt-5">
              <ProfileNameField name={user.name} />
            </div>

            <div className="flex flex-col gap-1 border-t border-gray-900/10 pt-5">
              <span className="text-label text-gray-400 uppercase">
                Заказов
              </span>
              <span className="text-total text-gray-900 tabular-nums">
                {orders.length}
              </span>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="text-label hover:border-error-500 hover:text-error-600 mt-auto h-12 rounded-full border border-gray-900/10 text-gray-500 uppercase transition-colors"
            >
              Выйти
            </button>
          </section>

          <section className="flex flex-col gap-4 lg:col-span-8">
            <h2 className="text-total text-gray-900">История заказов</h2>

            {orders.length ? (
              <OrderList orders={orders} />
            ) : (
              <EmptyState
                icon={<LogoMonogram className="size-16" />}
                title="Заказов пока нет"
                description="Оформите первый — он появится здесь вместе со статусом."
                action={
                  <Link
                    to={ROUTES.catalog}
                    className="text-label hover:border-brand-500 hover:text-brand-600 flex items-center gap-2 rounded-full border border-gray-900/10 px-5 py-3 text-gray-900 uppercase transition-colors"
                  >
                    В каталог
                    <IconArrowUpRight className="size-4" />
                  </Link>
                }
              />
            )}
          </section>
        </div>
      ) : (
        <EmptyState
          icon={<LogoMonogram className="size-16" />}
          title="Войдите в профиль"
          description="По номеру телефона сохранятся заказы, адреса и история покупок."
          action={<SignInButton>Войти по номеру</SignInButton>}
        />
      )}
    </div>
  );
}
