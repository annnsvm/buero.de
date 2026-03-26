import type { FC } from 'react';
import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  CoursesCatalogHero,
  CoursesCatalogFilters,
  CoursesCatalogList,
} from '@/features/courses-catalog';

import { useAppDispatch } from '@/redux/hooks';
import {
  selectCoursesCatalogItems,
  selectCoursesCatalogTotalCount,
  selectCoursesCatalogFilters,
} from '@/redux/slices/coursesCatalog/coursesCatalogSelectors';
import { setFilters } from '@/redux/slices/coursesCatalog/coursesCatalogSlice';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';

const filterTabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'sociocultural', label: 'Culture & Life' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'middle', label: 'Middle' },
  { id: 'advanced', label: 'Advanced' },
];

// const mockCourses = [
//   {
//     id: '1',
//     title: 'German A1 – Foundations',
//     category: 'Language',
//     levelLabel: 'A1',
//     badge: 'Free trial',
//     imageUrl: '/images/courses/course-1.webp',
//     description:
//       'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
//     price: '€69',
//     lessonsCount: 32,
//     durationHours: 24,
//     tags: ['Beginner', 'Grammar', 'Vocabulary'],
//     rating: 4.9,
//   },
//   {
//     id: '2',
//     title: 'German A2 – Foundations',
//     category: 'Language',
//     levelLabel: 'A1',
//     badge: 'Free trial',
//     imageUrl: '/images/courses/course-1.webp',
//     description:
//       'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
//     price: '$55',
//     lessonsCount: 12,
//     durationHours: 6,
//     tags: ['Grammar', 'Vocabulary'],
//     rating: 4.8,
//   },
//   {
//     id: '3',
//     title: 'German B1 – Foundations',
//     category: 'Language',
//     levelLabel: 'A1',
//     badge: 'Free trial',
//     imageUrl: '/images/courses/course-1.webp',
//     description:
//       'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
//     price: '$55',
//     lessonsCount: 12,
//     durationHours: 6,
//     tags: ['Grammar', 'Vocabulary'],
//     rating: 4.8,
//   },
//   {
//     id: '4',
//     title: 'German A1 – Foundations',
//     category: 'Language',
//     levelLabel: 'A1',
//     badge: 'Free trial',
//     imageUrl: '/images/courses/course-1.webp',
//     description:
//       'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
//     price: '€69',
//     lessonsCount: 32,
//     durationHours: 24,
//     tags: ['Beginner', 'Grammar', 'Vocabulary'],
//     rating: 4.9,
//   },
//   {
//     id: '5',
//     title: 'German A1 – Foundations',
//     category: 'Language',
//     levelLabel: 'A1',
//     badge: 'Free trial',
//     imageUrl: '/images/courses/course-1.webp',
//     description:
//       'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
//     price: '€69',
//     lessonsCount: 32,
//     durationHours: 24,
//     tags: ['Beginner', 'Grammar', 'Vocabulary'],
//     rating: 4.9,
//   },
// ];


const CoursesCatalogPage: FC = () => {
  const dispatch = useAppDispatch();
  
  const courses = useSelector(selectCoursesCatalogItems);
  
  const filters = useSelector(selectCoursesCatalogFilters);
  // console.log(filters)
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
  }, [dispatch, filters]);

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

  const handleSearchChange = useCallback((search: string) => {
    dispatch(
      setFilters({
        ...filtersRef.current,
        search: search.trim() || undefined,
      })
    );
  }, [dispatch]);


  return (
    <div aria-label="Courses-Catalog Page">
      <CoursesCatalogHero
        onSearchChange={handleSearchChange}
        // initialSearch={filters.title ?? filters.description ?? ''}
        initialSearch={filters.search ?? ''}
      />
      <CoursesCatalogFilters
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
      />
      
      {courses.length > 0 ? (
        <CoursesCatalogList courses={courses} />
      ) : (
        <div className="flex justify-center items-center py-20 text-lg text-[var(--color-text-primary)]">
          No courses found. Try adjusting your filters.
        </div>
      )}
    </div> 
  );
};





export default CoursesCatalogPage;

