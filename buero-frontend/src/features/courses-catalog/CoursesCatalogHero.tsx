import type { FC } from 'react';
import { Container, Section } from '@/components/layout';
import CatalogBackground from './CatalogBackground'
import CourseSearch from './CourseSearch'


const CoursesCatalogHero: FC = () => {
  return (
    <Section className="p-0">
      <div className="relative w-full h-[634px] overflow-hidden">
        <CatalogBackground /> 
        <Container className="relative z-10 flex flex-col items-center  justify-center pb-32 text-[var(--color-white)] md:pt-46 md:pb-36 text-text-left md:px-20">

       <div className="items-center w-full max-w-[768px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary mb-3">
            Course catalog
          </p>

          <h1 className="max-w-2xl text-lg font-semibold tracking-tight leading-tight md:text-7xl">
            Choose your path
          </h1>

          <p className="mt-4 max-w-xl text-lg  opacity-90">
            Language courses, integration guides, and cultural deep-dives. 
            Start with a free trial or dive right in.
          </p>

         
          <CourseSearch onSearch={(query) => console.log('Шукаєм:', query)} />
          </div>

        </Container>
      </div>
    </Section>
  );
};

export default CoursesCatalogHero;