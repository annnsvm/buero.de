import { Section,Container } from '@/components/layout';

type FilterChip = {
    id: string;
    label: string;
  };
const CoursesCatalogFilters = ({
  filters,
  activeFilterId,
  onFilterChange,
  totalCount,
}: CoursesFiltersBarProps) => {
  return (
    <Section className="bg-white py-8">
      <Container className="md:px-20">    
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive = filter.id === activeFilterId;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onFilterChange(filter.id)}
                  className={`
                    rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-400 hover:text-gray-600'
                    }
                  `}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm font-medium text-gray-400">
            {totalCount} {totalCount === 1 ? 'course found' : 'courses found'}
          </p>

        </div>
      </Container>
    </Section>
  );
};

export default CoursesCatalogFilters;
