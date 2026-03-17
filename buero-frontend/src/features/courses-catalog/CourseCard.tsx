import type { FC } from 'react';
import Icon from '@/components/ui/Icon';
import { useModal } from '@/components/modal';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

// export type CourseCardProps = {
//   id: string;
//   title: string;
//   category: string;
//   levelLabel: string;
//   badge?: string;
//   imageUrl: string;
//   description: string;
//   price: string;
//   lessonsCount: number;
//   durationHours: number;
//   tags: string[];
//   rating?: number;
//   isAdded?: boolean;
//   onClick?: () => void;
// };
// const CourseCard: FC<CourseCardProps> = ({
//   id,
//   title,
//   category,
//   levelLabel,
//   badge,
//   imageUrl,
//   description,
//   price,
//   lessonsCount,
//   durationHours,
//   tags,
//   rating,
//   isAdded,
//   hasTrial = true,
// }) => {
const CourseCard: FC<CourseCardProps> = (rawProps) => {
  const {
    id,
    title,
    category,
    levelLabel,
    badge,
    imageUrl,
    description,
    price,
    lessonsCount,
    durationHours,
    tags,
    rating,
    isAdded,
    hasTrial = true,
  } = rawProps;

  
  const displayTitle = title || 'German A2 Basics';
  const displayCategory = category || 'LANGUAGE';
  const displayLevelLabel = levelLabel || 'A2';
  const displayImageUrl =
    imageUrl ||
    "/images/courses/course-1.webp";
  const displayDescription =
    description ||
    'Introduction to German language. Learn the basics of communication, grammar and vocabulary.';
  const displayPrice = price || '€69,00';
  const displayLessonsCount = lessonsCount || 12;
  const displayDurationHours = durationHours || 10;
  const displayTags =
    (tags && tags.length > 0
      ? tags
      : ['Beginner', 'Grammar', 'Vocabulary']) ?? [];

  const { pushUiModal } = useModal();

  const openCourseInfo = () => {
    pushUiModal({
      type: 'courseInfo',
      courseId: id,
      course: {
        id,
        title,
        category,
        levelLabel,
        badge,
        imageUrl,
        description,
        price,
        lessonsCount,
        durationHours,
        tags,
        rating,
        isAdded,
        hasTrial,
      },
    });
  };

  // const handleCardClick = () => openCourseInfo();
  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCourseInfo();
  };

  

  return (
    <article
      // role="button"
      tabIndex={0}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 w-full h-full min-w -[303] max-w-[405px] cursor-pointer"
      // onClick={handleCardClick}
      // onKeyDown={(e) => {
      //   if (e.key === 'Enter' || e.key === ' ') {
      //     e.preventDefault();
      //     handleCardClick();
      //   }
      // }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={displayImageUrl}
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[25px] bg-[var(--color-neutral-white)] text-[10px] font-bold text-[var(--color-text-primary)] shadow-sm sm:h-8 sm:w-8 sm:text-[11px]">
            {displayLevelLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)] sm:text-[10px]">
          {displayCategory}
        </p>

        <h3 className="mt-2 text-[18px] font-bold text-[var(--color-text-primary)] leading-tight sm:mt-3 sm:text-[22px]">
          {displayTitle}
        </h3>

        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:mt-3 sm:text-sm">
          {displayDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
         {displayTags?.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-[var(--color-dawn-pink-light)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-default)] sm:px-3 sm:py-1.5 sm:text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <div className="mt-4 flex items-center justify-between text-[var(--color-text-secondary)] sm:t-6">
            <div className="flex gap-3 text-[11px] sm:gap-5 sm:text-[12px]">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="icon-book" size={16} className="text-[var(--color-neutral-light)]" />
                {displayLessonsCount} lessons
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="icon-schedule" size={16} className="text-[var(--color-neutral-light)]" />
                {displayDurationHours}h
              </span>
            </div>
          </div>
          <div className="mt-4 flex  gap-2 sm:mt-5  items-center justify-between">
            <span className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
              {displayPrice}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBuyClick}
                className="flex-1 flex max-w-[140px] items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all sm:px-6 sm:py-3 sm:text-sm bg-[var(--color-primary)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)] shadow-md active:scale-95"
              >
                Buy Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
