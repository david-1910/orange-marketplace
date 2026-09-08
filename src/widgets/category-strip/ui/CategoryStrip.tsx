import { motion } from 'motion/react';
import { Link } from 'react-router';

import { buildCatalogCategoryPath, useCategories } from '@/entities/category';
import { MOTION_STAGGER, MOTION_TRANSITION } from '@/shared/config';
import { SectionHeading, Skeleton } from '@/shared/ui';

const STRIP_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION_STAGGER } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: MOTION_TRANSITION.section },
};

/**
 * Полоса категорий на главной.
 *
 * Здесь это ссылки в каталог, а не фильтр: на главной задача —
 * увести человека в нужный раздел, поэтому каждая плашка ведёт на
 * /catalog с уже выставленным query-параметром. Фильтрация внутри
 * каталога — отдельная фича со своим состоянием.
 */
export function CategoryStrip() {
  const { data: categories, isPending } = useCategories();

  return (
    <section className="mx-auto w-full max-w-[110rem] px-4 py-14 sm:px-8">
      <SectionHeading label="Категории" title="Куда пойдём" className="mb-6" />

      {isPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={STRIP_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {categories?.map((category) => (
            <motion.div key={category.id} variants={ITEM_VARIANTS}>
              <Link
                to={buildCatalogCategoryPath(category.id)}
                className="hover:border-brand-400 hover:bg-brand-50 flex h-28 flex-col items-start justify-between rounded-2xl border border-gray-900/5 bg-white p-4 transition-colors"
              >
                <span aria-hidden className="text-3xl leading-none">
                  {category.emoji}
                </span>
                <span className="text-ui font-medium text-gray-900">
                  {category.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
