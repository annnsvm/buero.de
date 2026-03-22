import type { CourseLevel } from '@/types/features/courseManagment/CourseLevel.types';

export type CourseDetailsSectionProps = {
  courseName: string;
  courseDescription: string;
  level: CourseLevel;
  nameError?: string;
  descriptionError?: string;
  levelError?: string;
  disabled?: boolean;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeLevel: (value: CourseLevel) => void;
};
