import { Section, Container } from '@/components/layout';
import Button from '@/components/ui/Button';
import type { CoursesCatalogFiltersProps } from '@/types/features/courses-catalog/CoursesCatalogFilters.types';

const CoursesCatalogFilters = ({
  filters,
  activeFilterId,
  onFilterChange,
  totalCount,
}: CoursesCatalogFiltersProps) => {
  return (
    <Section className="sm:pt-12 pb-20">
      <Container className="md:px-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive = filter.id === activeFilterId;
              return (
                <Button
                  key={filter.id}
                  type="button"
                  styleType="mobile"
                  className={`rounded-full px-4 py-2 text-[16px] font-medium leading-[1.5] border ${
                    isActive
                      ? 'bg-[var(--color-neutral-darkest)] border-[var(--color-neutral-darkest)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-neutral-dark)]'
                      : 'bg-[var(--color-white)] text-[var(--color-text-primary)] border-[var(--opacity-neutral-darkest-15)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-neutral-darkest)]'
                  }`}
                  onClick={() => onFilterChange(filter.id)}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>
          <p className="text-base font-medium leading-[1.5] text-[var(--color-text-primary)]">
            {totalCount} {totalCount === 1 ? 'course found' : 'courses found'}
          </p>
        </div>
      </Container>
    </Section>
  );
};

export default CoursesCatalogFilters;
