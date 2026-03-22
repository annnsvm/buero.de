import type { CourseLevel } from '@/types/features/courseManagment/CourseLevel.types';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';

export const COURSE_LEVEL_OPTIONS: Array<{ value: CourseLevel; label: string }> = [
  { value: '', label: 'Choose level' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
];

export const CURRENCY_OPTIONS: Array<{ value: CurrencySymbol; label: string }> = [
  { value: '€', label: '€' },
  { value: '$', label: '$' },
  { value: '£', label: '£' },
];

export const TAG_SUGGESTIONS = [
  'Beginner',
  'Grammar',
  'Vocabulary',
  'Listening',
  'Speaking',
  'Reading',
  'Writing',
  'A1',
  'A2',
  'B1',
  'B2',
] as const;

