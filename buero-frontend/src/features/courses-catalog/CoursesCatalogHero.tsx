import type { FC } from 'react';
import { Container, Section } from '@/components/layout';
import CatalogBackground from './CatalogBackground';
import CourseSearch from './CourseSearch';

export type CoursesCatalogHeroProps = {
  onSearchChange?: (query: string) => void;
  initialSearch?: string;
};

const CoursesCatalogHero: FC<CoursesCatalogHeroProps> = ({
  onSearchChange,
  initialSearch = '',
}) => {
  return (
    <Section className="pb-20 sm:pb-28">
      <div className="relative w-full h-[634px] overflow-hidden">
        <CatalogBackground />
        <Container
          className="relative z-10 flex flex-col items-center justify-center pt-38 pb-28 md:px-20"
        >
          <div className="w-full max-w-[617px]  items-center">
            <p className="mb-4 font-semibold uppercase  text-[var(--color-accent-primary)]">
              Course catalog
            </p>
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-[family-name:var(--font-heading)] leading-[1.2] tracking-[-0.01em] text-[var(--color-white)]">
              Choose your path
            </h1>
            <p className="mb-8 text-lg md:text-xl leading-[1.5] text-[var(--color-white)]">
              Language courses, integration guides, and cultural deep-dives. Start with a free trial or
              dive right in.
            </p>
            <CourseSearch
              onSearch={onSearchChange ?? (() => {})}
              initialSearch={initialSearch}
            />
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default CoursesCatalogHero;