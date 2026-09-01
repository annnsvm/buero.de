import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type SimpleBarCore from 'simplebar-core';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks';
import { BaseDialog, ModalScrollArea, useModal } from '@/components/modal';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui';
import CheckoutButton from '@/features/subscriptions/components/CheckoutButton';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { subscriptionApi } from '@/api/subscriptionApi';
import { optimizeCloudinaryUrl } from '@/helpers/optimizeCloudinaryUrl';
import { prefetchCourseWorkspace } from '@/api/courseWorkspaceCache';
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
import { translateCourseTag } from './translateCourseTag';
import { isCourseComingSoon } from './isCourseComingSoon';

type CourseInfoModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onExitAnimationComplete?: () => void;
  courseId: string;
  course: CourseInfoData;
};

const CourseInfoModal: React.FC<CourseInfoModalProps> = ({
  isOpen,
  handleOpenChange,
  onExitAnimationComplete,
  courseId,
  course,
}) => {
  const { pushUiModal } = useModal();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const scrollAreaRef = useRef<SimpleBarCore | null>(null);

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
        const hasAccess = userHasAccessToCourse(arr, courseId);
        setHasCourseAccess(hasAccess);
        setActiveTrialCourseIdFromApi(getActiveTrialCourseIdFromAccessList(arr));
        if (hasAccess) prefetchCourseWorkspace(courseId);
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
    prefetchCourseWorkspace(courseId);
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
      dispatch(fetchCoursesCatalogThunk({ force: true }));
      dispatch(fetchCourseByIdThunk(courseId));
    } finally {
      setIsPublishing(false);
    }
  }, [courseId, dispatch, isPublishing, publishedEffective]);

  const handleContactSupport = () => {
    pushUiModal({
      type: 'contactSupport',
      courseId,
      subject: t('courses.modal.supportSubject'),
    });
  };

  const safeCategory = course.category || 'Language';

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

  const comingSoon = isCourseComingSoon({
    isPublished: publishedEffective,
    lessonsCount: course.lessonsCount,
  });

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
    if (!isOpen) return;
    const el = scrollAreaRef.current?.getScrollElement();
    if (el) el.scrollTop = 0;
  }, [isOpen, courseId]);

  const contentClassName = [
    'buero-dialog-panel-tall relative z-[1] flex min-h-0 w-[min(960px,calc(100vw-1rem))] flex-col overflow-hidden',
    'sm:w-[min(960px,calc(100vw-2rem))] md:w-[min(960px,calc(100vw-3rem))] lg:w-[min(960px,calc(100vw-4rem))]',
    'rounded-xl sm:rounded-2xl bg-[var(--color-surface-overlay)] focus:outline-none',
  ].join(' ');
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
      contentClassName={contentClassName}
      closeButtonClassName="text-white hover:text-[var(--color-primary)]"
    >
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <ModalScrollArea ref={scrollAreaRef} className="h-full rounded-t-xl sm:rounded-t-2xl">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl">
              <img
                src={optimizeCloudinaryUrl(course.imageUrl, 'modal')}
                alt={course.title}
                className="h-full w-full object-cover"
                decoding="async"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 sm:top-6 sm:left-6 md:top-7 md:left-8 lg:top-8 lg:left-10">
                <span className="flex items-center justify-center rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-primary)] sm:text-sm md:text-base">
                  {course.levelLabel}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6 sm:gap-3 md:bottom-7 md:left-8 md:gap-4 lg:bottom-8 lg:left-10">
                {(course.tags ?? []).map((tag: string) => {
                  if (!tag) return null;

                  const displayTag = translateCourseTag(t, tag);

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

            <div className="px-5 pt-6 pb-4 sm:px-7 sm:pt-8 sm:pb-5 md:px-10 md:pt-9 md:pb-6 lg:px-12 lg:pt-10 xl:px-14 xl:pt-11">
              <div className="flex flex-col px-0 sm:px-1 md:px-2">
                <h2 className="mt-3 text-xl leading-tight font-semibold tracking-[-0.01em] text-[var(--color-neutral-darkest)] sm:mt-4 sm:text-[22px] md:text-2xl lg:text-[26px]">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--color-neutral-darkest)] sm:text-base md:text-lg">
                  {course.description}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 px-4 py-4 sm:gap-2.5 sm:px-5 sm:py-5">
                  <p className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase sm:text-sm">
                    {t('courses.modal.duration')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name="icon-schedule"
                      className="h-7 w-7 shrink-0 text-[var(--color-text-primary)] sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
                    />
                    <p className="text-[28px] leading-none font-semibold text-[var(--color-text-primary)] tabular-nums sm:text-[32px] md:text-[36px] lg:text-[40px]">
                      {course.durationHours}h
                    </p>
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 px-4 py-4 sm:gap-2.5 sm:px-5 sm:py-5">
                  <p className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase sm:text-sm">
                    {t('courses.modal.lessons')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Icon
                      name="icon-book"
                      className="h-7 w-7 shrink-0 text-[var(--color-text-primary)] sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
                    />
                    <p className="text-[28px] leading-none font-semibold text-[var(--color-text-primary)] tabular-nums sm:text-[32px] md:text-[36px] lg:text-[40px]">
                      {course.lessonsCount}
                    </p>
                  </div>
                </div>
              </div>

              {isLoading && rawModules.length === 0 ? (
                <div className="mt-6 flex items-center justify-center p-4">
                  <p className="text-lg text-[var(--color-text-secondary)]">
                    {t('courses.modal.loadingStructure')}
                  </p>
                </div>
              ) : (
                <CourseStructure
                  key={`${courseId}-${courseStructureKeyFromModules(rawModules)}`}
                  modules={rawModules}
                />
              )}

              <div className="mt-5 rounded-lg border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-base)] px-4 py-6 sm:mt-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:py-12">
                <p className="text-lg leading-[1.3] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-xl md:text-2xl lg:text-[28px]">
                  {t('courses.modal.questionsTitle')}
                </p>
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="mt-5 flex items-center gap-2 rounded-full bg-[var(--color-black)] px-4 py-2 text-xs font-medium text-[var(--color-neutral-white)] hover:opacity-90 sm:mt-6 sm:gap-3 sm:px-6 sm:py-2.5 sm:text-sm md:text-base lg:text-lg"
                >
                  <Icon name="icon-mail" size={24} className="text-[var(--color-neutral-white)]" />
                  {t('courses.modal.contactSupport')}
                </button>
              </div>
            </div>
          </ModalScrollArea>
        </div>

        <div
          className="pointer-events-auto relative z-30 shrink-0 border-t border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-surface-overlay)] px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:px-7 sm:py-5 md:px-10 lg:px-12 xl:px-14"
          role="region"
          aria-label={t('courses.modal.priceActions')}
        >
          <div className="flex flex-row flex-wrap items-center justify-between gap-3">
            <span className="mr-1 text-2xl leading-[1.3] font-semibold tracking-[-0.01em] text-[var(--color-primary)] sm:mr-0 sm:text-3xl md:text-[32px] lg:text-[34px]">
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
                  aria-label={
                    publishedEffective
                      ? t('courses.modal.unpublishCourse')
                      : t('courses.modal.publishCourse')
                  }
                >
                  {isPublishing
                    ? t('courses.modal.saving')
                    : publishedEffective
                      ? t('courses.modal.unpublish')
                      : t('courses.modal.publish')}
                </Button>
              </div>
            ) : isStudent && isAuthenticated && !accessResolved ? (
              <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
                {t('courses.modal.checkingAccess')}
              </p>
            ) : isStudent && isAuthenticated && hasCourseAccess ? (
              <Button
                type="button"
                variant="solid"
                className="rounded-full border-0 px-3 py-1 text-xs font-medium text-[var(--color-text-on-accent)] sm:px-6 sm:py-2.5 sm:text-lg"
                onClick={handleContinueLearning}
              >
                {t('courses.continueLearning')}
              </Button>
            ) : comingSoon ? (
              <span className="inline-flex items-center justify-center rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-light)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] sm:px-6 sm:py-2.5 sm:text-lg">
                {t('courses.comingSoon')}
              </span>
            ) : (
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-4">
                {canShowTryForFree ? (
                  <button
                    type="button"
                    onClick={handleTryForFree}
                    className="rounded-full border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-3 py-1 text-xs font-medium text-[var(--color-text-primary)] shadow-sm hover:border-[var(--color-border-strong)] hover:bg-[var(--opacity-neutral-darkest-5)] sm:px-6 sm:py-2.5 sm:text-lg"
                    aria-label={t('courses.modal.tryForFreeAria')}
                  >
                    {t('courses.modal.tryForFree')}
                  </button>
                ) : null}
                <CheckoutButton
                  courseId={courseId}
                  label={t('courses.buyCourse')}
                  onRequireAuth={handleClose}
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
