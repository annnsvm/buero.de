import type { FC } from 'react';
import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CoursesCatalogHero,
  CoursesCatalogFilters,
  CoursesCatalogList,
  CoursesCatalogGridSkeleton,
} from '@/features/courses-catalog';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCoursesCatalogItems,
  selectCoursesCatalogTotalCount,
  selectCoursesCatalogFilters,
  selectCoursesCatalogStatus,
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
  const catalogStatus = useSelector(selectCoursesCatalogStatus);
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(true);

  const isCatalogPending =
    catalogStatus === 'loading' ||
    (catalogStatus === 'idle' && courses.length === 0);

  useEffect(() => {
    if (catalogStatus === 'loading') {
      setShowLoadingSkeleton(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowLoadingSkeleton(false);
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [catalogStatus]);

  const showCatalogGridSkeleton =
    showLoadingSkeleton ||
    (catalogStatus === 'idle' && courses.length === 0 && role !== 'teacher');

  const filterTabs = useMemo(() => {
    if (role === 'teacher') {
      return [...baseFilterTabs, ...teacherExtraTabs];
    }
    return [...baseFilterTabs];
  }, [role]);


  const activeFilterId = (() => {
    if (role === 'teacher') {
      switch (filters.publicationStatus) {
        case 'published':
        case 'unpublished':
          return filters.publicationStatus;
      }
    }

    switch (filters.tags) {
      case 'language':
      case 'integration':
      case 'sociocultural':
      case 'beginner':
      case 'middle':
      case 'advanced':
        return filters.tags;
      default:
        return 'all';
    }
  })();

  useEffect(() => {
    dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters, role, isAuthenticated]);


  const handleFilterChange = (id: string) => {
    switch (id) {
      case 'published':
      case 'unpublished':
        if (role === 'teacher') {
          dispatch(
            setFilters({
              ...filters,
              publicationStatus: id,
              tags: undefined,
            })
          );
        }
        break;
  
      case 'all':
        dispatch(
          setFilters({
            ...filters,
            tags: undefined,
            publicationStatus: undefined,
          })
        );
        break;
  
      case 'language':
      case 'integration':
      case 'sociocultural':
      case 'beginner':
      case 'middle':
      case 'advanced':

        dispatch(
          setFilters({
            ...filters,
            tags: id, 
            publicationStatus: undefined,
          })
        );
        break;
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
        isResultsCountPending={isCatalogPending}
      />

      {showCatalogGridSkeleton ? (
        <CoursesCatalogGridSkeleton withTeacherCreateSlot={role === 'teacher'} />
      ) : courses.length > 0 || role === 'teacher' ? (
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
