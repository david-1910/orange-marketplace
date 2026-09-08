import { Link } from 'react-router';

import { ROUTES, cursorLabel } from '@/shared/config';
import { IconCardPay, IconTruck, LogoFull, Magnet } from '@/shared/ui';

const LINK_GROUPS = [
  {
    title: 'Покупателям',
    links: [
      { label: 'Каталог', to: ROUTES.catalog },
      { label: 'Доставка', to: ROUTES.catalog },
      { label: 'Возврат', to: ROUTES.catalog },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', to: ROUTES.home },
      { label: 'Вакансии', to: ROUTES.home },
      { label: 'Контакты', to: ROUTES.home },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-900/10 bg-white">
      <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-10 px-4 py-12 sm:px-8 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4">
          <Link to={ROUTES.home} {...cursorLabel('на главную')}>
            <LogoFull />
          </Link>

          <p className="text-ui max-w-[32ch] text-gray-500">
            Маркетплейс Узбекистана. Доставка по Ташкенту за два часа.
          </p>

          <div className="text-label flex items-center gap-4 text-gray-400 uppercase">
            <span className="flex items-center gap-2">
              <IconTruck className="size-4" />
              Доставка
            </span>
            <span className="flex items-center gap-2">
              <IconCardPay className="size-4" />
              Оплата картой
            </span>
          </div>
        </div>

        <div className="flex gap-12 sm:gap-20">
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} className="flex flex-col gap-3">
              <span className="text-label text-gray-400 uppercase">
                {group.title}
              </span>

              {group.links.map((link) => (
                <Magnet key={link.label} radius={60} strength={0.25}>
                  <Link
                    to={link.to}
                    {...cursorLabel(link.label)}
                    className="text-ui hover:text-brand-600 text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </Magnet>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-900/5">
        <p className="text-label mx-auto w-full max-w-[110rem] px-4 py-6 text-gray-400 uppercase sm:px-8">
          © 2026 Orange.uz — все права защищены
        </p>
      </div>
    </footer>
  );
}
