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
];

const mockCourses = [
  {
    id: '1',
    title: 'German A1 – Foundations',
    category: 'Language',
    levelLabel: 'A1',
    badge: 'Free trial',
    imageUrl: '/images/courses/course-1.webp',
    description:
      'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
    price: '€69',
    lessonsCount: 32,
    durationHours: 24,
    tags: ['Beginner', 'Grammar', 'Vocabulary'],
    rating: 4.9,
  },
  {
    id: '2',
    title: 'German A2 – Foundations',
    category: 'Language',
    levelLabel: 'A1',
    badge: 'Free trial',
    imageUrl: '/images/courses/course-1.webp',
    description:
      'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
    price: '$55',
    lessonsCount: 12,
    durationHours: 6,
    tags: ['Grammar', 'Vocabulary'],
    rating: 4.8,
  },
  {
    id: '3',
    title: 'German B1 – Foundations',
    category: 'Language',
    levelLabel: 'A1',
    badge: 'Free trial',
    imageUrl: '/images/courses/course-1.webp',
    description:
      'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
    price: '$55',
    lessonsCount: 12,
    durationHours: 6,
    tags: ['Grammar', 'Vocabulary'],
    rating: 4.8,
  },
  {
    id: '4',
    title: 'German A1 – Foundations',
    category: 'Language',
    levelLabel: 'A1',
    badge: 'Free trial',
    imageUrl: '/images/courses/course-1.webp',
    description:
      'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
    price: '€69',
    lessonsCount: 32,
    durationHours: 24,
    tags: ['Beginner', 'Grammar', 'Vocabulary'],
    rating: 4.9,
  },
  {
    id: '5',
    title: 'German A1 – Foundations',
    category: 'Language',
    levelLabel: 'A1',
    badge: 'Free trial',
    imageUrl: '/images/courses/course-1.webp',
    description:
      'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocab.',
    price: '€69',
    lessonsCount: 32,
    durationHours: 24,
    tags: ['Beginner', 'Grammar', 'Vocabulary'],
    rating: 4.9,
  },
];


const CoursesCatalogPage: FC = () => {
  const dispatch = useAppDispatch();
  const courses = useSelector(selectCoursesCatalogItems);
  const totalCount = useSelector(selectCoursesCatalogTotalCount);
  const filters = useSelector(selectCoursesCatalogFilters);
  const filtersRef = useRef(filters);

  const activeFilterId =
    filters.category === 'language'
      ? 'language'
      : filters.category === 'integration'
      ? 'integration'
      : filters.category === 'sociocultural'
      ? 'sociocultural'
      : 'all';

  useEffect(() => {
    dispatch(fetchCoursesCatalogThunk());
  }, [dispatch, filters]);

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
        initialSearch={filters.search ?? ''}
      />
      <CoursesCatalogFilters
        filters={filterTabs}
        activeFilterId={activeFilterId}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
      />
      <CoursesCatalogList courses={courses.length > 0?courses:mockCourses} />
    </div>
  );
};




export default CoursesCatalogPage;

