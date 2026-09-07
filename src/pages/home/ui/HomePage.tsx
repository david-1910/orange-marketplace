import { Link } from 'react-router';

import { buildCatalogPath, cursorLabel } from '@/shared/config';
import { IconArrowUpRight, SectionHeading } from '@/shared/ui';
import { CategoryStrip } from '@/widgets/CategoryStrip';
import { HeroPoster } from '@/widgets/HeroPoster';
import { ProductGrid } from '@/widgets/ProductGrid';
import { PromoBanner } from '@/widgets/PromoBanner';

/**
 * Главная. Страница только компонует блоки, своей логики не имеет.
 *
 * Секция «Популярное» собрана здесь, а не отдельным виджетом:
 * ей нужны SectionHeading и ProductGrid, а виджет не имеет права
 * импортировать другой виджет — это импорт внутри одного слоя.
 * Композиция разных слоёв — работа страницы.
 */
export function HomePage() {
  return (
    <>
      <HeroPoster />

      <CategoryStrip />

      <section className="mx-auto w-full max-w-[110rem] px-4 py-14 sm:px-8">
        <SectionHeading
          label="Подборка"
          title="Популярное сейчас"
          className="mb-6"
          action={
            <Link
              to={buildCatalogPath()}
              {...cursorLabel('все товары')}
              className="text-label hover:border-brand-500 hover:text-brand-600 flex items-center gap-2 rounded-full border border-gray-900/10 px-5 py-3 text-gray-900 uppercase transition-colors"
            >
              Все товары
              <IconArrowUpRight className="size-4" />
            </Link>
          }
        />

        <ProductGrid categoryId={null} limit={10} />
      </section>

      <PromoBanner />
    </>
  );
}
