import type { ButtonHTMLAttributes } from 'react';

export type CourseCardProps = {
  variant?: string;
  id: string;
  title: string;
  category: string;
  levelLabel: string;
  badge?: string;
  imageUrl: string;
  imagePriority?: boolean;
  description: string;
  price: string;
  lessonsCount: number;
  durationHours: number;
  avgVideoLessonMinutes?: number | null;
  tags: string[];
  rating?: number;
  isAdded?: boolean;
  hasTrial?: boolean;
  activeTrialCourseId?: string | null;
  isPublished?: boolean;
  onClick?: () => void;
  modulesCount?: number;
  onCourseDeleted?: () => void;
  onPublicationChange?: () => void;
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: (element: HTMLButtonElement | null) => void;
  };
  isDragging?: boolean;
};
