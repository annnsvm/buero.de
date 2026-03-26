import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseDialog, useModal } from '@/components/modal';
import Icon from '@/components/ui/Icon';
import CheckoutButton from '@/features/subscriptions/components/CheckoutButton';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import CourseStructure from './CourseStructure';
import { courseStructureKeyFromModules } from './courseStructure.helpers';
import { fetchCourseByIdThunk } from '@/redux/slices/coursesCatalog/courseDetailsThunks'; 
import { clearCourseDetails } from '@/redux/slices/coursesCatalog/courseDetailsSlice'; 
import { 
  selectCourseDetailsData, 
  selectCourseDetailsStatus 
} from '@/redux/slices/coursesCatalog/courseDetailsSelectors';



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
  
  
  const dispatch = useDispatch();

  const fullCourseData = useSelector(selectCourseDetailsData);
  const status = useSelector(selectCourseDetailsStatus);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (isOpen && courseId) {
      
      dispatch(fetchCourseByIdThunk(courseId));
    } else if (!isOpen) {
      
      dispatch(clearCourseDetails());
    }
  }, [isOpen, courseId, dispatch]);

  const handleClose = () => handleOpenChange(false);

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

  const hasAnyMaterials = fullCourseData?.modules?.some(
    (mod) => mod.materials && mod.materials.length > 0
  );
  
  const rawModules = hasAnyMaterials 
    ? fullCourseData.modules 
    : [];

    const contentClassName = 'fixed top-1/2 left-1/2 z-[1001] w-[calc(100%-2rem)] max-w-[640px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-surface-overlay)] overflow-hidden flex flex-col focus:outline-none [&>button]:top-7 [&>button]:right-7 [&>button]:h-8 [&>button]:w-8 [&>button]:text-[var(--color-neutral-white)] [&>button]:transition-colors [&>button:hover]:text-[var(--color-primary)]';
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      contentClassName={contentClassName}
      
    >
      <div className="flex flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-1.5 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  [&::-webkit-scrollbar-thumb]:bg-[var(--opacity-neutral-darkest-15)] 
  ">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute top-7 left-8.5 sm:top-8.5 sm:left-10.5 flex items-center gap-2">
            <span className="flex items-center justify-center rounded-full bg-[var(--color-neutral-white)] text-xs sm:text-base font-semibold text-[var(--color-text-primary)] px-2.5 py-1 border border-[var(--opacity-neutral-darkest-15)]">
              {course.levelLabel}
            </span>
          </div>

          <div className="absolute bottom-7 left-8.5 sm:bottom-8.5 sm:left-10.5 flex flex-wrap gap-2 sm:gap-4">
            {course.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full text-xs border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-2.5 py-1 font-semibold text-[var(--color-text-primary)] sm:text-base"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-8.5 py-8 sm:px-10.5 sm:py-10">
          <div className="flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase sm:text-base">
              {/* {course.category.toUpperCase()} */}
              {safeCategory.toUpperCase()}
            </p>
            <h2 className="mt-4 text-[22px] sm:text-[26px] leading-tight font-semibold tracking-[-0.01em] text-[var(--color-neutral-darkest)]">
              {course.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-base sm:text-lg text-[var(--color-neutral-darkest)]">
              {course.description}
            </p>
          </div>

          <div className="align-items-left mt-6 flex gap-18 sm:gap-50 px-4 py-4 sm:px-6 sm:py-6">
            <div className="align-items-left">
              <p className="text-base font-semibold text-[var(--color-text-secondary)] uppercase">
                Duration
              </p>
              <div className="flex items-center gap-0.5">
                <Icon name="icon-schedule"  className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--color-text-primary)]" />
                <p className="text-[33px] sm:text-[40px] font-semibold text-[var(--color-text-primary)]">
                  {course.durationHours}h
                </p>
              </div>
            </div>
            <div className="align-items-left">
              <p className="text-base font-semibold text-[var(--color-text-secondary)] uppercase">
                Lessons
              </p>
              <div className="flex items-center gap-0.5">
                <Icon name="icon-book" className="w-8 h-8 sm:w-12 sm:h-12 text-[var(--color-text-primary)]" />
                <p className="text-[33px] sm:text-[40px] font-semibold text-[var(--color-text-primary)]">
                  {course.lessonsCount}
                </p>
              </div>
            </div>
          </div>

          {isLoading && rawModules.length === 0 ? (
            <div className="mt-6 flex items-center justify-center p-4">
              <p className="text-[var(--color-text-secondary)] text-lg">Завантаження структури курсу...</p>
            </div>
          ) : (
            <CourseStructure
              key={`${courseId}-${courseStructureKeyFromModules(rawModules)}`}
              modules={rawModules}
            />
          )}

          <div className="mt-6 py-6 px-6 sm:py-12 rounded-lg bg-[var(--color-dawn-pink-base)] border border-[var(--opacity-neutral-darkest-15)]">
            <p className="text-[24px] sm:text-[28px] font-semibold text-[var(--color-text-primary)] leading-[1.3] tracking-[-0.01em]">
              Have questions about this course?
            </p>
            <button
              type="button"
              onClick={handleContactSupport}
              className="mt-8 flex items-center gap-3 rounded-full bg-[var(--color-black)] px-4 py-1.5  sm:px-6 sm:py-2.5 text-xs sm:text-lg font-medium text-[var(--color-neutral-white)] hover:opacity-90"
            >
              <Icon name="icon-mail" size={24} className="text-[var(--color-neutral-white)]" />
              Contact Support
            </button>
          </div>
          <div className="flex shrink-0 mt-6 flex-row items-center justify-between py-4">
            <span className="text-[24spx] mr-1 sm:mr-0 sm:text-[32px] font-semibold text-[var(--color-primary)] leading-[1.3] tracking-[-0.01em]">
              {totalPrice}
            </span>
            <div className="flex gap-2 sm:gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-[var(--opacity-neutral-darkest-15)] px-3 py-1 sm:px-6 sm:py-2.5 text-xs sm:text-lg font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-neutral-darkest)]"
              >
                Try for free
              </button>
              <CheckoutButton
                courseId={courseId}
                className="rounded-full bg-[var(--color-primary)] px-3 py-1 sm:px-6 sm:py-2.5 text-xs sm:text-lg font-medium text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)]"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};

export default CourseInfoModal;
