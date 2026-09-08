import { motion } from 'motion/react';
import { Link } from 'react-router';

import { MOTION_TRANSITION, ROUTES } from '@/shared/config';
import { IconArrowUpRight, IconTag } from '@/shared/ui';

const PROMO_CODE = 'ORANGE20';

/** Промо-полоса: скидка на первый заказ. */
export function PromoBanner() {
  return (
    <section className="mx-auto w-full max-w-[110rem] px-4 py-14 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={MOTION_TRANSITION.section}
        className="from-brand-500 to-accent-400 flex flex-col gap-8 rounded-3xl bg-linear-135 p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-col gap-4">
          <span className="text-label flex items-center gap-2 text-white/80 uppercase">
            <IconTag className="size-4" />
            Акция недели
          </span>

          <p className="text-display-sm max-w-[24ch] uppercase">
            Скидка 20% на первый заказ
          </p>

          <p className="text-ui text-white/80">
            Промокод действует до конца месяца на все категории.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <code className="rounded-xl border border-dashed border-white/50 bg-white/15 px-6 py-4 font-mono text-2xl font-bold tracking-widest">
            {PROMO_CODE}
          </code>

          <Link
            to={ROUTES.catalog}
            className="text-label text-brand-600 flex items-center gap-2 rounded-full bg-white px-6 py-4 uppercase transition-transform hover:-translate-y-0.5"
          >
            Выбрать товары
            <IconArrowUpRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
