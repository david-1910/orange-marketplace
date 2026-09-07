import { Link } from 'react-router';

import { ROUTES } from '@/shared/config';

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <p className="text-display-sm uppercase">404</p>
      <Link to={ROUTES.home} className="text-label text-brand-600 uppercase">
        На главную
      </Link>
    </div>
  );
}
