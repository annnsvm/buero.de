import type { ReactNode } from 'react';

export type CoursesCatalogFilterTab = {
  id: string;
  label: string;
};

export type CoursesCatalogFiltersProps = {
  filters: CoursesCatalogFilterTab[];
  activeFilterId: string;
  onFilterChange: (id: string) => void;
  totalCount: number;
  isResultsCountPending?: boolean;
  besideCountSlot?: ReactNode;
};
