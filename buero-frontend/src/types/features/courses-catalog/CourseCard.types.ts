export type CourseCardProps = {
  variant?: string;
  id: string;
  title: string;
  category: string;
  levelLabel: string;
  badge?: string;
  imageUrl: string;
  description: string;
  price: string;
  lessonsCount: number;
  durationHours: number;
  tags: string[];
  rating?: number;
  isAdded?: boolean;
  hasTrial?: boolean;
  isPublished?: boolean;
  onClick?: () => void;
  modulesCount?: number;
  onCourseDeleted?: () => void;
  /** Після зміни публікації (наприклад refetch каталогу). */
  onPublicationChange?: () => void;
};
