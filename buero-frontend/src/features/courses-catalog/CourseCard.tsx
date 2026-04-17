import { useCallback, useEffect, useState, type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '@/components/ui/Icon';
import { useModal } from '@/components/modal';
import { ROUTES, getTeacherCourseEditPath } from '@/helpers/routes';
import LinkBtn from '@/components/ui/Link';
import { Button } from '@/components/ui';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import ConfirmDeleteEntityModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmDeleteEntityModal';
import { deleteCourseCopy } from '@/features/course-managment/domain/deleteCourseCopy';
import { requestCourseTrial } from '@/features/courses-catalog/courseTrialFlow';
import { useAppDispatch } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/auth';
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
    activeTrialCourseId = null,
    isPublished,
    variant = '',
    modulesCount: modulesCountProp,
    onCourseDeleted,
  } = rawProps;

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

  
  const { pushUiModal } = useModal();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

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
        activeTrialCourseId,
        isPublished,
      },
    });
  };
  const handleCardClick = (e: MouseEvent) => {
    
    const isButtonClick = (e.target as HTMLElement).closest('button, a');
    
    if (isButtonClick) {
      return;
    }
  
    openCourseInfo();
  };
  const handleBuyClick = (e: MouseEvent) => {
    e.stopPropagation();
    openCourseInfo();
  };

  const trialButtonClassName =
    'flex max-w-[140px] items-center justify-center rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--opacity-neutral-darkest-5)] active:scale-95 sm:px-5 sm:py-2 sm:text-lg';

  const canShowTrialButton =
    hasTrial &&
    (activeTrialCourseId == null ||
      activeTrialCourseId === '' ||
      activeTrialCourseId === id);

  const handleTrialClick = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!canShowTrialButton) return;
    await requestCourseTrial(id, isAuthenticated, dispatch, navigate);
  };

  const showPublicationBadge =
    variant === 'teacher-catalog' && typeof isPublished === 'boolean';

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
        <div className="flex w-full min-w-0 flex-col gap-2 sm:gap-3">
          <div className="flex w-full min-w-0 flex-row items-stretch gap-2 sm:gap-3">
            <span className="min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
              <LinkBtn
                to={getTeacherCourseEditPath(id)}
                variant="dark"
                className="min-w-0 w-full !w-auto"
              >
                Edit course
              </LinkBtn>
            </span>
            <Button
              type="button"
              variant="outlineDark"
              className="min-w-0 flex-1"
              onClick={handleRemoveCourseClick}
              aria-label={`Remove course ${title}`}
            >
              Remove course
            </Button>
          </div>
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

    case 'catalog': {
      if (isAdded) {
        buttonsComponent = (
          <LinkBtn to={`${ROUTES.COURSES}/${id}`} variant="dark">
            Continue Learning
          </LinkBtn>
        );
      } else {
        buttonsComponent = (
          <>
            <span className="text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl">
              {displayPrice}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              {canShowTrialButton ? (
                <button
                  type="button"
                  onClick={handleTrialClick}
                  className={trialButtonClassName}
                  aria-label={`Start trial for ${title}`}
                >
                  Trial
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleBuyClick}
                className="flex max-w-[140px] items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-on-accent)] shadow-md transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 sm:px-5 sm:py-2 sm:text-lg"
              >
                Buy Course
              </button>
            </div>
          </>
        );
      }
      break;
    }

    default:
      buttonsComponent = (
        <>
          <span className="text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl">
            {displayPrice}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {canShowTrialButton ? (
              <button
                type="button"
                onClick={handleTrialClick}
                className={trialButtonClassName}
                aria-label={`Start trial for ${title}`}
              >
                Trial
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleBuyClick}
              className="flex max-w-[140px] items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-on-accent)] shadow-md transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 sm:px-5 sm:py-2 sm:text-lg"
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
      : deleteCourseCopy(moduleCountForModal ?? 0);

  const isDeleteSubmitBlocked =
    isDeletingCourse || (moduleCountForModal === null && isLoadingDeleteInfo);
  return (
    <>
      <article
        tabIndex={0}
        onClick={handleCardClick}
         
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCourseInfo();
    }
  }}
        className="group flex h-full w-full max-w-[405px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-[var(--color-neutral-white)] text-xs sm:text-base font-semibold text-[var(--color-text-primary)] px-2.5 py-1 border border-[var(--opacity-neutral-darkest-15)]">  
              {levelLabel}
            </span>
            {showPublicationBadge ? (
              <span
                className={
                  isPublished
                    ? 'inline-flex items-center justify-center rounded-full bg-[#16a34a] px-3.5 py-1.5 text-xs font-semibold leading-none text-white shadow-sm sm:text-sm'
                    : 'inline-flex items-center justify-center rounded-full bg-[#f06a4d] px-3.5 py-1.5 text-xs font-semibold leading-none text-white shadow-sm sm:text-sm'
                }
              >
                {isPublished ? 'Published' : 'Unpublished'}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <h3 className="mt-4 text-22 text-[26px] leading-tight font-semibold leading-[1.4] tracking-[-0.01em] sm:text-[26px] text-[var(--color-neutral-darkest)]">
            {title}
          </h3>

          <p className="mt-2 min-h-[81px] line-clamp-3 text-[18px] text-[var(--color-neutral-darkest)]">
            {description}
          </p>
          <div className="mt-4 min-h-[60px] items-start content-start flex flex-wrap gap-2 sm:mt-6 sm:gap-4">
            {tags?.slice(0, 5).map((tag) => {
              if (!tag) return null;
              const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
              return(
               <span
                key={tag}
                className="rounded-full text-xs border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-2.5 py-1 font-semibold text-[var(--color-text-primary)] sm:text-base"
              >
                {displayTag}
               </span>
              )
})}

            {tags && tags.length > 5 && (
              <span className="rounded-full text-xs border border-transparent bg-[var(--color-dawn-pink-light)] px-2.5 py-1 font-semibold text-[var(--color-text-secondary)] sm:text-base">
                +{tags.length - 5}
              </span>
            )}
          </div>
            <div className="mt-auto pt-6 flex items-center gap-2 text-xs text-[var(--color-text-primary)]">
             <span className="flex items-center gap-1.5 sm:gap-2">
               <Icon name="icon-book" size={24} className="text-[var(--color-text-primary)]" />
                 {lessonsCount} lessons
             </span>
  
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Icon name="icon-schedule" size={24} className="text-[var(--color-text-primary)]" />
               {durationHours}h
            </span>
            </div>

            
            <div className="mt-4 flex flex-row gap-2 sm:mt-5 items-center flex-wrap justify-between"
            >
              {buttonsComponent}
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
