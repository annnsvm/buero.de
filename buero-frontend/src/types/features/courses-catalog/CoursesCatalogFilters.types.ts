export type CatalogFilterChip = {
  id: string;
  label: string;
};

export type CoursesCatalogFiltersProps = {
  filters: CatalogFilterChip[];
  activeFilterId: string;
  onFilterChange: (filterId: string) => void;
  totalCount: number;
};
