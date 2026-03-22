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
  onClick?: () => void;
  /** Якщо задано — показується в модалці видалення; інакше кількість підвантажується з GET /courses/:id */
  modulesCount?: number;
  /** Після успішного DELETE /courses/:id (наприклад refetch каталогу) */
  onCourseDeleted?: () => void;
};
