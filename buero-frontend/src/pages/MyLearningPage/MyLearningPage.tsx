import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchMyLearningCoursesFromCatalog,
  filterMyLearningCourses,
} from '@/api/myLearningCourses';
import { CoursesCatalogFilters, CoursesCatalogGridSkeleton } from '@/features/courses-catalog';
import { MyCoursesList } from '@/features/my-courses-catalog';
import { useSelector } from 'react-redux';
import { setFilters } from '@/redux/slices/coursesCatalog';
import { useAppDispatch } from '@/redux/hooks';
import { selectCoursesCatalogFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import type {
  MyLearningCatalogFilterTab,
  MyLearningLoadStatus,
} from '@/types/pages/MyLearningPage/MyLearningPage.types';
import { Input } from '@/components/ui';

const filterTabs: MyLearningCatalogFilterTab[] = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'sociocultural', label: 'Culture & Life' },
];

const MyLearningPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useSelector(selectCoursesCatalogFilters);
  const filtersRef = useRef(filters);

  const [myCourses, setMyCourses] = useState<CourseInfoData[]>([]);
  const [loadStatus, setLoadStatus] = useState<MyLearningLoadStatus>('loading');

  const activeFilterId =
    filters.category === 'language'
      ? 'language'
      : filters.category === 'integration'
        ? 'integration'
        : filters.category === 'sociocultural'
          ? 'sociocultural'
          : 'all';

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadStatus('loading');
      try {
        const data = await fetchMyLearningCoursesFromCatalog();
        if (!cancelled) {
          setMyCourses(data);
          setLoadStatus('idle');
        }
      } catch {
        if (!cancelled) setLoadStatus('error');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCourses = useMemo(
    () => filterMyLearningCourses(myCourses, filters),
    [myCourses, filters],
  );
  const totalCount = visibleCourses.length;

  const handleFilterChange = (id: string) => {
    if (id === 'all') {
      dispatch(setFilters({ ...filters, category: undefined }));
    } else if (id === 'language') {
      dispatch(setFilters({ ...filters, category: 'language' }));
    } else if (id === 'integration') {
      dispatch(setFilters({ ...filters, category: 'integration' }));
    } else if (id === 'sociocultural') {
      dispatch(setFilters({ ...filters, category: 'sociocultural' }));
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
    <div className="min-h-screen bg-[var(--color-soapstone-base)] pt-31">
      <CoursesCatalogFilters
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
        isResultsCountPending={loadStatus === 'loading'}
        besideCountSlot={
          <div className="flex w-full flex-col gap-1">
            <Input
              id="my-learning-search"
              name="search"
              value={filters.search ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full"
            />
          </div>
        }
      />
      {loadStatus === 'loading' ? (
        <CoursesCatalogGridSkeleton
          sectionClassName="bg-white"
          loadingLabel="Loading your courses"
        />
      ) : loadStatus === 'error' ? (
        <p className="py-12 text-center text-[var(--color-error)]">Could not load your courses.</p>
      ) : (
        <MyCoursesList courses={visibleCourses} />
      )}
    </div>
  );
};

export default MyLearningPage;
