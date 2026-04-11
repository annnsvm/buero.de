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
  /** Якщо задано і не збігається з id картки — кнопку Trial не показуємо (trial уже на іншому курсі). */
  activeTrialCourseId?: string | null;
  isPublished?: boolean;
  onClick?: () => void;
  modulesCount?: number;
  onCourseDeleted?: () => void;
  /** Після зміни публікації (наприклад refetch каталогу). */
  onPublicationChange?: () => void;
};
