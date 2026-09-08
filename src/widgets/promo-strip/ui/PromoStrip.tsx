import { useState } from 'react';

import { motion } from 'motion/react';
import { Link } from 'react-router';

import { usePromos } from '@/entities/promo';
import { MOTION_TRANSITION, ROUTES } from '@/shared/config';
import { cn, notify } from '@/shared/lib';
import { IconCheck, IconTag, Skeleton } from '@/shared/ui';

export interface PromoStripProps {
  className?: string;
}

export function PromoStrip({ className }: PromoStripProps) {
  const { data: promos, isLoading } = usePromos();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);
      notify.success(`Промокод ${code} скопирован`);

      // Отметка «скопировано» держится недолго: она про только что
      // сделанный клик, а не про состояние промокода.
      window.setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      notify.info(`Промокод: ${code}`);
    }
  };

  if (isLoading) {
    return <Skeleton className={cn('h-32 rounded-2xl', className)} />;
  }

  if (!promos?.length) return null;

  return (
    <section
      aria-label="Промокоды"
      className={cn(
        'from-brand-500 to-brand-700 relative overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white sm:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="flex flex-col gap-1">
          <span className="text-label flex items-center gap-2 text-white/70 uppercase">
            <IconTag className="size-4" />
            Промокоды
          </span>
          <p className="text-total">Скидка уже ждёт в корзине</p>
          <p className="text-ui text-white/80">
            Нажмите на код, чтобы скопировать — вставите при оформлении.
          </p>
        </div>

        <ul className="grid w-full min-w-0 flex-1 grid-cols-3 items-stretch gap-2">
          {promos.map((promo) => {
            const isCopied = copiedCode === promo.code;

            return (
              <li key={promo.code} className="flex h-full">
                <button
                  type="button"
                  onClick={() => void copy(promo.code)}
                  aria-label={`Скопировать промокод ${promo.code}, скидка ${promo.percent} процентов, ${promo.hint}`}
                  className={cn(
                    'flex h-[114px] w-full flex-col items-start gap-0.5 rounded-xl border border-dashed px-4 py-2.5 text-left transition-colors',
                    isCopied
                      ? 'text-brand-600 border-white bg-white'
                      : 'border-white/50 bg-white/10 text-white hover:bg-white/20',
                  )}
                >
                  <span className="text-ui flex items-center gap-1.5 font-mono font-semibold tracking-wider">
                    {promo.code}
                    {isCopied && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={MOTION_TRANSITION.ui}
                        className="grid place-items-center"
                      >
                        <IconCheck className="size-3.5" />
                      </motion.span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-label tabular-nums',
                      isCopied ? 'text-brand-500' : 'text-white/70',
                    )}
                  >
                    −{promo.percent}% · {promo.hint}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        to={ROUTES.cart}
        className="text-label mt-4 inline-flex text-white/80 uppercase underline-offset-4 transition-colors hover:text-white hover:underline"
      >
        Перейти в корзину
      </Link>
    </section>
  );
}
