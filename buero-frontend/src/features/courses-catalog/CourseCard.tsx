import { useCallback, useEffect, useState, type FC, type MouseEvent } from 'react';
import Icon from '@/components/ui/Icon';
import { useModal } from '@/components/modal';
import { ROUTES, getTeacherCourseEditPath } from '@/helpers/routes';
import LinkBtn from '@/components/ui/Link';
import { Button } from '@/components/ui';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import ConfirmDeleteEntityModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmDeleteEntityModal';
import { buildDeleteCourseDescription } from '@/features/course-managment/helpers/courseEntityDeleteCopy.helpers';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

export type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

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
    variant = '',
    modulesCount: modulesCountProp,
    onCourseDeleted,
  } = rawProps;

  const displayTitle = title || 'German A2 Basics';
  const displayCategory = category || 'LANGUAGE';
  const displayLevelLabel = levelLabel || 'A2';
  const displayImageUrl = imageUrl || '/images/courses/course-1.webp';
  const displayDescription =
    description ||
    'Introduction to German language. Learn the basics of communication, grammar and vocabulary.';

  const cleanPrice =
    parseFloat(
      String(price)
        .replace(/[^\d.,]/g, '')
        .replace(',', '.'),
    ) || 69;

  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cleanPrice);

  const displayLessonsCount = lessonsCount || 12;
  const displayDurationHours = durationHours || 10;

  const displayTags =
    (tags && tags.length > 0 ? tags : ['Beginner', 'Grammar', 'Vocabulary']) ?? [];

  const { pushUiModal } = useModal();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resolvedModuleCount, setResolvedModuleCount] = useState<number | null>(null);
  const [isLoadingDeleteInfo, setIsLoadingDeleteInfo] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

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

  const handleBuyClick = (e: MouseEvent) => {
    e.stopPropagation();
    openCourseInfo();
  };

  const handleDeleteModalOpenChange = useCallback((open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setResolvedModuleCount(null);
      setIsLoadingDeleteInfo(false);
    }
  }, []);

  useEffect(() => {
    if (!isDeleteModalOpen || variant !== 'teacher-catalog') return;
    if (typeof modulesCountProp === 'number') {
      setResolvedModuleCount(modulesCountProp);
      setIsLoadingDeleteInfo(false);
      return;
    }

    let cancelled = false;
    setIsLoadingDeleteInfo(true);
    setResolvedModuleCount(null);

    const load = async () => {
      try {
        const { data } = await apiInstance.get<{ modules?: unknown[] }>(
          API_ENDPOINTS.courses.byId(id),
        );
        if (cancelled) return;
        const n = Array.isArray(data.modules) ? data.modules.length : 0;
        setResolvedModuleCount(n);
      } catch {
        if (!cancelled) setResolvedModuleCount(0);
      } finally {
        if (!cancelled) setIsLoadingDeleteInfo(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isDeleteModalOpen, variant, id, modulesCountProp]);

  const handleRemoveCourseClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  let buttonsComponent = null;
  switch (variant) {
    case 'teacher-catalog': {
      buttonsComponent = (
        <div className="flex w-full min-w-0 flex-row items-stretch gap-2 sm:gap-3">
          <LinkBtn
            to={getTeacherCourseEditPath(id)}
            variant="dark"
            className="min-w-0 flex-1 !w-auto"
          >
            Edit course
          </LinkBtn>
          <Button
            type="button"
            variant="outlineDark"
            className="min-w-0 flex-1"
            onClick={handleRemoveCourseClick}
            aria-label={`Remove course ${displayTitle}`}
          >
            Remove course
          </Button>
        </div>
      );
      break;
    }

    case 'my-learning': {
      buttonsComponent = (
        <LinkBtn to={`${ROUTES.COURSES}/${id}`} variant="dark">
          Continue Learning
        </LinkBtn>
      );
      break;
    }
    default:
      buttonsComponent = (
        <>
          <span className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
            {displayPrice}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBuyClick}
              className="flex max-w-[140px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-[var(--color-text-on-accent)] shadow-md transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
            >
              Buy Course
            </button>
          </div>
        </>
      );
  }

  const moduleCountForModal =
    typeof modulesCountProp === 'number' ? modulesCountProp : resolvedModuleCount;

  const deleteDescription =
    moduleCountForModal === null && isLoadingDeleteInfo
      ? 'Loading course details…'
      : buildDeleteCourseDescription(moduleCountForModal ?? 0);

  const isDeleteSubmitBlocked =
    isDeletingCourse || (moduleCountForModal === null && isLoadingDeleteInfo);

  return (
    <>
      <article
        tabIndex={0}
        className="group flex h-full w-full max-w-[405px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={displayImageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[25px] bg-[var(--color-neutral-white)] text-[10px] font-bold text-[var(--color-text-primary)] shadow-sm sm:h-8 sm:w-8 sm:text-[11px]">
              {displayLevelLabel}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[var(--color-primary)] uppercase sm:text-[10px]">
            {displayCategory}
          </p>

          <h3 className="mt-2 text-[18px] leading-tight font-bold text-[var(--color-text-primary)] sm:mt-3 sm:text-[22px]">
            {displayTitle}
          </h3>

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:mt-3 sm:text-sm">
            {displayDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {displayTags?.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-dawn-pink-light)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] sm:px-3 sm:py-1.5 sm:text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-auto">
            <div className="sm:t-6 mt-4 flex items-center justify-between text-[var(--color-text-secondary)]">
              <div className="flex gap-3 text-[11px] sm:gap-5 sm:text-[12px]">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Icon name="icon-book" size={16} className="text-[var(--color-neutral-light)]" />
                  {displayLessonsCount} lessons
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Icon
                    name="icon-schedule"
                    size={16}
                    className="text-[var(--color-neutral-light)]"
                  />
                  {displayDurationHours}h
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-2 sm:mt-5 flex-wrap justify-between">
              {buttonsComponent}
            </div>
          </div>
        </div>
      </article>

      {variant === 'teacher-catalog' ? (
        <ConfirmDeleteEntityModal
          isOpen={isDeleteModalOpen}
          handleOpenChange={handleDeleteModalOpenChange}
          title="Delete course?"
          description={deleteDescription}
          confirmButtonLabel="Delete"
          isSubmitting={isDeleteSubmitBlocked}
          onConfirm={async () => {
            setIsDeletingCourse(true);
            try {
              await apiInstance.delete(API_ENDPOINTS.courses.delete(id));
              onCourseDeleted?.();
            } finally {
              setIsDeletingCourse(false);
            }
          }}
        />
      ) : null}
    </>
  );
};

export default CourseCard;
