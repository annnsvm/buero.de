import type { FC } from 'react';
import { useEffect, useCallback, useRef, useMemo } from 'react';
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
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { selectUserRole } from '@/redux/slices/user/userSelectors';

const baseFilterTabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'sociocultural', label: 'Culture & Life' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'middle', label: 'Middle' },
  { id: 'advanced', label: 'Advanced' },
] as const;

const teacherExtraTabs = [
  { id: 'published', label: 'Published' },
  { id: 'unpublished', label: 'Unpublished' },
] as const;

const CoursesCatalogPage: FC = () => {
  const dispatch = useAppDispatch();

  const courses = useSelector(selectCoursesCatalogItems);

  const filters = useSelector(selectCoursesCatalogFilters);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const filtersRef = useRef(filters);

  const totalCount = useSelector(selectCoursesCatalogTotalCount);

  const filterTabs = useMemo(() => {
    if (role === 'teacher') {
      return [...baseFilterTabs, ...teacherExtraTabs];
    }
    return [...baseFilterTabs];
  }, [role]);

  const activeFilterId = (() => {
    if (role === 'teacher') {
      if (filters.publicationStatus === 'published') return 'published';
      if (filters.publicationStatus === 'unpublished') return 'unpublished';
    }
    if (filters.tags === 'language') return 'language';
    if (filters.tags === 'integration') return 'integration';
    if (filters.tags === 'sociocultural') return 'sociocultural';
    if (filters.tags === 'beginner') return 'beginner';
    if (filters.tags === 'middle') return 'middle';
    if (filters.tags === 'advanced') return 'advanced';
    return 'all';
  })();

  useEffect(() => {
    dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters, role, isAuthenticated]);

  const handleFilterChange = (id: string) => {
    if (role === 'teacher') {
      if (id === 'published') {
        dispatch(
          setFilters({
            ...filters,
            publicationStatus: 'published',
            tags: undefined,
          }),
        );
        return;
      }
      if (id === 'unpublished') {
        dispatch(
          setFilters({
            ...filters,
            publicationStatus: 'unpublished',
            tags: undefined,
          }),
        );
        return;
      }
    }

    if (id === 'all') {
      dispatch(
        setFilters({
          ...filters,
          tags: undefined,
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'language') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'language',
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'integration') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'integration',
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'sociocultural') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'sociocultural',
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'beginner') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'beginner',
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'middle') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'middle',
          publicationStatus: undefined,
        }),
      );
      return;
    }
    if (id === 'advanced') {
      dispatch(
        setFilters({
          ...filters,
          tags: 'advanced',
          publicationStatus: undefined,
        }),
      );
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

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
      ) : (
        <div className="flex items-center justify-center py-20 text-lg text-[var(--color-text-primary)]">
          <p>No courses found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesCatalogPage;
