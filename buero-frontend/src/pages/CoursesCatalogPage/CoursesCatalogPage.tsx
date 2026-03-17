import type { FC } from 'react';
import {
  CoursesCatalogHero,
  CoursesCatalogFilters,
  CoursesCatalogList,
  type CourseCardProps,
} from '@/features/courses-catalog';

const mockFilters = [
  { id: 'all', label: 'All Courses' },
  { id: 'language', label: 'Language' },
  { id: 'integration', label: 'Integration' },
  { id: 'culture', label: 'Culture & Life' },
];

const mockCourses: CourseCardProps[] = [
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
    tags: ['Beginner','Grammar', 'Vocabulary'],
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
    tags: ['Beginner','Grammar', 'Vocabulary'],
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
    tags: ['Beginner','Grammar', 'Vocabulary'],
    rating: 4.9,
  },
];

const CoursesCatalogPage: FC = () => {
  return (
    <div aria-label="Courses-Catalog Page">
      <CoursesCatalogHero />
      <CoursesCatalogFilters
            filters={mockFilters}
            activeFilterId="all"
            onFilterChange={() => {}}
            totalCount={mockCourses.length}
          />
          
          <CoursesCatalogList courses={mockCourses} />
    </div>
  );
};

export default CoursesCatalogPage;

