import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks';
import { BaseDialog, useModal } from '@/components/modal';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui';
import CheckoutButton from '@/features/subscriptions/components/CheckoutButton';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { subscriptionApi } from '@/api/subscriptionApi';
import { getCoursePath } from '@/helpers/routes';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import CourseStructure from './CourseStructure';
import { courseStructureKeyFromModules } from './courseStructure.helpers';
import {
  getActiveTrialCourseIdFromAccessList,
  userHasAccessToCourse,
} from './courseAccessModal.helpers';
import { fetchCourseByIdThunk } from '@/redux/slices/coursesCatalog/courseDetailsThunks';
import { clearCourseDetails } from '@/redux/slices/coursesCatalog/courseDetailsSlice';
import {
  selectCourseDetailsData,
  selectCourseDetailsStatus,
} from '@/redux/slices/coursesCatalog/courseDetailsSelectors';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { selectUserRole } from '@/redux/slices/user/userSelectors';
import { requestCourseTrial } from '@/features/courses-catalog/courseTrialFlow';
import {
  applyTrialModuleScope,
  type ApiCourseWithTree,
} from '@/pages/CoursePage/coursePageMappers';

type CourseInfoModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  courseId: string;
  course: CourseInfoData;
};

const CourseInfoModal: React.FC<CourseInfoModalProps> = ({
  isOpen,
  handleOpenChange,
  courseId,
  course,
}) => {
  const { pushUiModal } = useModal();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const fullCourseData = useSelector(selectCourseDetailsData);
  const status = useSelector(selectCourseDetailsStatus);
  const isLoading = status === 'loading';
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [accessResolved, setAccessResolved] = useState(false);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);
  const [activeTrialCourseIdFromApi, setActiveTrialCourseIdFromApi] = useState<string | null>(null);
  const [localPublished, setLocalPublished] = useState<boolean | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const publishedEffective =
    localPublished ?? (typeof course.isPublished === 'boolean' ? course.isPublished : false);

  useEffect(() => {
    if (isOpen && courseId) {
      dispatch(fetchCourseByIdThunk(courseId));
    } else if (!isOpen) {
      dispatch(clearCourseDetails());
    }
  }, [isOpen, courseId, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setAccessResolved(false);
      setHasCourseAccess(false);
      setActiveTrialCourseIdFromApi(null);
      setLocalPublished(null);
    } else {
      setLocalPublished(null);
    }
  }, [isOpen, courseId]);

  useEffect(() => {
    if (!isOpen || !courseId) return;

    if (!isAuthenticated || !isStudent) {
      setAccessResolved(true);
      setHasCourseAccess(false);
      return;
    }

    let cancelled = false;
    setAccessResolved(false);

    void (async () => {
      try {
        const list = await subscriptionApi.getMyAccess();
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setHasCourseAccess(userHasAccessToCourse(arr, courseId));
        setActiveTrialCourseIdFromApi(getActiveTrialCourseIdFromAccessList(arr));
      } catch {
        if (!cancelled) {
          setHasCourseAccess(false);
          setActiveTrialCourseIdFromApi(null);
        }
      } finally {
        if (!cancelled) setAccessResolved(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, courseId, isAuthenticated, isStudent]);

  const handleClose = () => handleOpenChange(false);

  const handleContinueLearning = () => {
    handleClose();
    navigate(getCoursePath(courseId));
  };

  const handleTryForFree = async () => {
    if (course.hasTrial === false) return;
    await requestCourseTrial(courseId, isAuthenticated, dispatch, navigate);
    handleClose();
  };

  const handleTogglePublication = useCallback(async () => {
    if (!courseId || isPublishing) return;
    const next = !publishedEffective;
    setIsPublishing(true);
    try {
      await apiInstance.patch(API_ENDPOINTS.courses.update(courseId), {
        is_published: next,
      });
      setLocalPublished(next);
      dispatch(fetchCoursesCatalogThunk());
      dispatch(fetchCourseByIdThunk(courseId));
    } finally {
      setIsPublishing(false);
    }
  }, [courseId, dispatch, isPublishing, publishedEffective]);

  const handleContactSupport = () => {
    pushUiModal({
      type: 'contactSupport',
      courseId,
      subject: 'Question about course',
    });
  };

  const safeCategory = course.category || 'Language';
 
  // const safeImageUrl = course.imageUrl || '/images/courses/course-1.webp';
  
  // const safeLessonsCount = course.lessonsCount || 12;
  // const safeDurationHours = course.durationHours || 10;
  

  const cleanPrice =
    parseFloat(
      String(course.price)
        .replace(/[^\d.,]/g, '')
        .replace(',', '.'),
    ) || 69;

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(cleanPrice);

  const canShowTryForFree =
    course.hasTrial !== false &&
    (activeTrialCourseIdFromApi == null ||
      activeTrialCourseIdFromApi === '' ||
      activeTrialCourseIdFromApi === courseId);

  const scopedCourseDetails = useMemo(() => {
    if (!fullCourseData) return null;
    return applyTrialModuleScope(fullCourseData as ApiCourseWithTree);
  }, [fullCourseData]);

  const hasAnyMaterials = scopedCourseDetails?.modules?.some(
    (mod) => mod.materials && mod.materials.length > 0,
  );

  const rawModules =
    hasAnyMaterials && scopedCourseDetails?.modules ? scopedCourseDetails.modules : [];

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen, courseId]);

  const contentClassName = [
    'fixed left-1/2 top-1/2 z-[1001] flex h-[90vh] max-h-[90vh] min-h-0 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden',
    'w-[min(960px,calc(100vw-1rem))] sm:w-[min(960px,calc(100vw-2rem))] md:w-[min(960px,calc(100vw-3rem))] lg:w-[min(960px,calc(100vw-4rem))]',
    'rounded-xl sm:rounded-2xl bg-[var(--color-surface-overlay)] focus:outline-none',
  ].join(' ');
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      contentClassName={contentClassName}
      closeButtonClassName="text-white hover:text-[var(--color-primary)]"
    >
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-t-xl sm:rounded-t-2xl [&::-webkit-scrollbar]:absolute [&::-webkit-scrollbar]:right-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) transparent' }}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl">
            <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6 md:left-8 md:top-7 lg:left-10 lg:top-8">
              <span className="flex items-center justify-center rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm md:text-base">
                {course.levelLabel}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6 md:bottom-7 md:left-8 lg:bottom-8 lg:left-10 sm:gap-3 md:gap-4">
            {(course.tags ?? []).map((tag: string) => {
    
    if (!tag) return null;

    const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

    return (
      <span
        key={tag}
        className="rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-primary)] sm:text-base"
      >
        {displayTag}
      </span>
    );
  })}
            </div>
          </div>

          <div className="px-5 pb-4 pt-6 sm:px-7 sm:pb-5 sm:pt-8 md:px-10 md:pb-6 md:pt-9 lg:px-12 lg:pt-10 xl:px-14 xl:pt-11">
            <div className="flex flex-col px-0 sm:px-1 md:px-2">
              <p className="text-xs font-semibold uppercase text-[var(--color-primary)] sm:text-sm md:text-base">
                {safeCategory.toUpperCase()}
              </p>
              <h2 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.01em] text-[var(--color-neutral-darkest)] sm:mt-4 sm:text-[22px] md:text-2xl lg:text-[26px]">
                {course.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--color-neutral-darkest)] sm:text-base md:text-lg">
                {course.description}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2 px-4 py-4 sm:gap-2.5 sm:px-5 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] sm:text-sm">
                  Duration
                </p>
                <div className="flex items-center gap-1.5">
                  <Icon
                    name="icon-schedule"
                    className="h-7 w-7 shrink-0 text-[var(--color-text-primary)] sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
                  />
                  <p className="text-[28px] font-semibold tabular-nums leading-none text-[var(--color-text-primary)] sm:text-[32px] md:text-[36px] lg:text-[40px]">
                    {course.durationHours}h
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2 px-4 py-4 sm:gap-2.5 sm:px-5 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] sm:text-sm">
                  Lessons
                </p>
                <div className="flex items-center gap-1.5">
                  <Icon
                    name="icon-book"
                    className="h-7 w-7 shrink-0 text-[var(--color-text-primary)] sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
                  />
                  <p className="text-[28px] font-semibold tabular-nums leading-none text-[var(--color-text-primary)] sm:text-[32px] md:text-[36px] lg:text-[40px]">
                    {course.lessonsCount}
                  </p>
                </div>
              </div>
            </div>

            {isLoading && rawModules.length === 0 ? (
              <div className="mt-6 flex items-center justify-center p-4">
                <p className="text-lg text-[var(--color-text-secondary)]">Завантаження структури курсу...</p>
              </div>
            ) : (
              <CourseStructure
                key={`${courseId}-${courseStructureKeyFromModules(rawModules)}`}
                modules={rawModules}
              />
            )}

            <div className="mt-5 rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-base)] px-4 py-6 sm:mt-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:py-12">
              <p className="text-lg font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-xl md:text-2xl lg:text-[28px]">
                Have questions about this course?
              </p>
              <button
                type="button"
                onClick={handleContactSupport}
                className="mt-5 flex items-center gap-2 rounded-full bg-[var(--color-black)] px-4 py-2 text-xs font-medium text-[var(--color-neutral-white)] hover:opacity-90 sm:mt-6 sm:gap-3 sm:px-6 sm:py-2.5 sm:text-sm md:text-base lg:text-lg"
              >
                <Icon name="icon-mail" size={24} className="text-[var(--color-neutral-white)]" />
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 border-t border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-surface-overlay)] px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:px-7 sm:py-5 md:px-10 lg:px-12 xl:px-14"
          role="region"
          aria-label="Course price and actions"
        >
          <div className="flex flex-row flex-wrap items-center justify-between gap-3">
            <span className="mr-1 text-2xl font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--color-primary)] sm:mr-0 sm:text-3xl md:text-[32px] lg:text-[34px]">
              {totalPrice}
            </span>
            {isTeacher ? (
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
                <Button
                  type="button"
                  variant="outlineDark"
                  className="rounded-full px-3 py-1 text-xs font-medium sm:px-6 sm:py-2.5 sm:text-lg"
                  disabled={isPublishing}
                  onClick={handleTogglePublication}
                  aria-label={publishedEffective ? 'Unpublish course' : 'Publish course'}
                >
                  {isPublishing
                    ? 'Saving…'
                    : publishedEffective
                      ? 'Unpublish'
                      : 'Publish'}
                </Button>
              </div>
            ) : isStudent && isAuthenticated && !accessResolved ? (
              <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
                Checking access…
              </p>
            ) : isStudent && isAuthenticated && hasCourseAccess ? (
              <Button
                type="button"
                variant="solid"
                className="rounded-full border-0 px-3 py-1 text-xs font-medium text-[var(--color-text-on-accent)] sm:px-6 sm:py-2.5 sm:text-lg"
                onClick={handleContinueLearning}
              >
                Continue Learning
              </Button>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
                {canShowTryForFree ? (
                  <button
                    type="button"
                    onClick={handleTryForFree}
                    className="rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-3 py-1 text-xs font-medium text-[var(--color-text-primary)] shadow-sm hover:border-[var(--color-border-strong)] hover:bg-[var(--opacity-neutral-darkest-5)] sm:px-6 sm:py-2.5 sm:text-lg"
                    aria-label="Try this course for free"
                  >
                    Try for free
                  </button>
                ) : null}
                <CheckoutButton
                  courseId={courseId}
                  label="Buy Course"
                  className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)] sm:px-6 sm:py-2.5 sm:text-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};

export default CourseInfoModal;
