import { Section, Container } from '@/components/layout';
import Button from '@/components/ui/Button';
import type { CoursesCatalogFiltersProps } from '@/types/features/courses-catalog/CoursesCatalogFilters.types';

const CoursesCatalogFilters = ({
  filters,
  activeFilterId,
  onFilterChange,
  totalCount,
  besideCountSlot,
}: CoursesCatalogFiltersProps) => {
  return (
    <Section className="pb-20">
      <Container className="md:px-20">
        <div 
        className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-start"
        >
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => {
              const isActive = filter.id === activeFilterId;
              return (
                <Button
                  key={filter.id}
                  type="button"
                  styleType="mobile"
                  className={`rounded-full px-4 py-2 text-lg font-medium leading-[1.5] border ${
                    isActive
                      ? 'bg-[var(--color-cod-gray-base)] border-[var--color-cod-gray-base)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-neutral-darkest)]'
                      : 'bg-[var(--color-white)] text-[var(--color-text-primary)] border-[var(--opacity-neutral-darkest-15)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-neutral-darkest)]'
                  }`}
                  onClick={() => onFilterChange(filter.id)}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>
          <div 
          className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4 md:py-2"
          
          >
            {besideCountSlot ? (
              <div className="min-w-0 sm:max-w-[min(100%,320px)]">{besideCountSlot}</div>
            ) : null}
            <p className="shrink-0 text-lg font-medium leading-[1.5] whitespace-nowrap text-[var(--color-text-primary)]">
              {totalCount} {totalCount === 1 ? 'course found' : 'courses found'}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CoursesCatalogFilters;
