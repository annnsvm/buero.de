import { CoursesCatalogList } from '@/features/courses-catalog';
import React from 'react'

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


const MyLearningPage: React.FC = () => {
  return <CoursesCatalogList courses={mockCourses} />;
}

export default MyLearningPage