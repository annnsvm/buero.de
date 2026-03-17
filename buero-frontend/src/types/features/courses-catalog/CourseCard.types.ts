export type CourseCardProps = {
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
   // onClick?: () => void;
   hasTrial?: boolean;
};
