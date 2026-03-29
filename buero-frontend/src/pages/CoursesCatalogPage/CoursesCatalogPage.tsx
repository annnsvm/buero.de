import type { FC } from 'react';
import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  CoursesCatalogHero,
  CoursesCatalogFilters,
  CoursesCatalogList,
} from '@/features/courses-catalog';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCoursesCatalogItems,
  selectCoursesCatalogTotalCount,
  selectCoursesCatalogFilters,
} from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import { setFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';

const filterTabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'sociocultural', label: 'Culture & Life' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'middle', label: 'Middle' },
  { id: 'advanced', label: 'Advanced' },
];

const CoursesCatalogPage: FC = () => {
  const dispatch = useAppDispatch();

  const courses = useSelector(selectCoursesCatalogItems);

  const filters = useSelector(selectCoursesCatalogFilters);
  const role = useAppSelector(selectUserRole);
  const filtersRef = useRef(filters);

  const totalCount = useSelector(selectCoursesCatalogTotalCount);

  const activeFilterId =
    filters.tags === 'language'
      ? 'language'
      : filters.tags === 'integration'
        ? 'integration'
        : filters.tags === 'sociocultural'
          ? 'sociocultural'
          : filters.tags === 'beginner'
            ? 'beginner'
            : filters.tags === 'middle'
              ? 'middle'
              : filters.tags === 'advanced'
                ? 'advanced'
                : 'all';

  useEffect(() => {
    dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters, role]);

  const handleFilterChange = (id: string) => {
    if (id === 'all') {
      dispatch(setFilters({ ...filters, tags: undefined }));
    } else if (id === 'language') {
      dispatch(setFilters({ ...filters, tags: 'language' }));
    } else if (id === 'integration') {
      dispatch(setFilters({ ...filters, tags: 'integration' }));
    } else if (id === 'sociocultural') {
      dispatch(setFilters({ ...filters, tags: 'sociocultural' }));
    } else if (id === 'beginner') {
      dispatch(setFilters({ ...filters, tags: 'beginner' }));
    } else if (id === 'middle') {
      dispatch(setFilters({ ...filters, tags: 'middle' }));
    } else if (id === 'advanced') {
      dispatch(setFilters({ ...filters, tags: 'advanced' }));
    }
  };

  const handleSearchChange = useCallback(
    (search: string) => {
      dispatch(
        setFilters({
          ...filtersRef.current,
          search: search.trim() || undefined,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div aria-label="Courses-Catalog Page">
      <CoursesCatalogHero
        onSearchChange={handleSearchChange}
        initialSearch={filters.search ?? ''}
      />
      <CoursesCatalogFilters
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
      />

      {courses.length > 0 || role === 'teacher' ? (
        <CoursesCatalogList courses={courses} />
      )  : (
        <div className="flex items-center justify-center py-20 text-lg text-[var(--color-text-primary)]">
          <p>No courses found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesCatalogPage;
