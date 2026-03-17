import React, { useState } from 'react';
import { BaseDialog, useModal } from '@/components/modal';
import Icon from '@/components/ui/Icon';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';
import CourseStructure from './CourseStructure'; // Перевір, щоб шлях до файлу був правильним!

const MOCK_MODULES = [
  {
    id: '1',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [
      { id: '1', title: 'Welcome to German A1', duration: '5:30' },
      { id: '2', title: 'The German Alphabet & Pronunciation', duration: '12:15' },
      { id: '3', title: 'Pronunciation Practice', duration: '8:00' },
      { id: '4', title: 'Your First German Words', duration: '10:45' },
    ],
  },
  {
    id: '2',
    title: 'Greetings & Introductions',
    lessonsCount: 4,
    lessons: [
      { id: '5', title: 'Saying Hello and Goodbye', duration: '6:20' },
      { id: '6', title: 'Introducing Yourself', duration: '9:15' },
      { id: '7', title: 'Asking Names', duration: '7:40' },
      { id: '8', title: 'Formal vs Informal', duration: '11:00' },
    ],
  },
  {
    id: '3',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [],
  },
  {
    id: '4',
    title: 'Getting Started',
    lessonsCount: 4,
    lessons: [],
  },
];

const MOCK_ADDONS = [
  { id: '1', title: 'Integration', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', price: '35$' },
  { id: '2', title: 'Visa support', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', price: '45$' },
  { id: '3', title: 'Visa support', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', price: '45$' },
];

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
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set(['1']));

  const handleClose = () => handleOpenChange(false);

  const handleContactSupport = () => {
    pushUiModal({
      type: 'contactSupport',
      courseId,
      subject: 'Question about course',
    });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const safeTitle = course?.title || 'German A2-Basics';
  const safeCategory = course?.category || 'Language';
  const safeDescription =
    course?.description ||
    'Start your German journey from zero. Build a solid base in pronunciation, grammar, and essential vocabulary.';
  const safeImageUrl =
    course?.imageUrl ||
    '/images/courses/course-1.webp';
  const safeLevelLabel = course?.levelLabel || 'A2';
  const safeBadge = course?.badge || undefined;
  const safeLessonsCount = course?.lessonsCount || 12;
  const safeDurationHours = course?.durationHours || 10;
  const safeTags =
    (course?.tags && course.tags.length > 0
      ? course.tags
      : ['Beginner', 'Grammar', 'Vocabulary']) ?? [];

  const modules = course?.modules ?? MOCK_MODULES;
  const addOns = course?.addOns ?? MOCK_ADDONS;

  const basePrice = course?.price
    ? parseFloat(String(course.price).replace(/[^\d.]/g, '')) || 84
    : 84;
  
  const totalPrice = `$${basePrice}`;

  const contentClassName =
    'fixed top-1/2 left-1/2 z-[1001] w-[calc(100%-2rem)] max-w-[640px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-surface-overlay)] overflow-hidden flex flex-col focus:outline-none';

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      contentClassName={contentClassName}
    >
      <div className="flex flex-1 flex-col overflow-y-auto">
        
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <img
            src={safeImageUrl}
            alt={safeTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[25px] bg-[var(--color-neutral-white)] text-[11px] font-bold text-[var(--color-text-primary)] shadow-sm">
              {safeLevelLabel}
            </span>
            {safeBadge && (
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-bold text-[var(--color-text-on-accent)] uppercase tracking-wider">
                {safeBadge}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {safeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-neutral-white)]/90 px-3 py-1 text-[10px] font-medium text-[var(--color-text-primary)] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-6 sm:px-6">
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
            {safeCategory.toUpperCase()}
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--color-text-primary)] leading-tight sm:text-[24px]">
            {safeTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {safeDescription}
          </p>

          <div className="mt-6 flex align-items-left gap-20 pb-6"> 
            <div className="align-items-left"> 
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Duration
              </p>
              <div className="flex items-center gap-3">
                <Icon name="icon-schedule" size={24} className="text-[var(--color-neutral-light)]" />
                <p className="text-lg font-bold text-[var(--color-text-primary)]">
                  {safeDurationHours}h
                </p>
              </div>
            </div>
            <div className="align-items-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Lessons
              </p>
              <div className="flex items-center gap-3">
                <Icon name="icon-book" size={24} className="text-[var(--color-neutral-light)]" />
                <p className="text-lg font-bold text-[var(--color-text-primary)]">
                  {safeLessonsCount}
                </p>
              </div>
            </div>
          </div>

          <CourseStructure modules={modules} />

          <div className="mt-8">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Add on top</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-[var(--color-burnt-siena-lightest)] p-4">
            <p className="font-bold text-[var(--color-text-primary)]">Have questions about this course?</p>
            <button
              type="button"
              onClick={handleContactSupport}
              className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-black)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-on-accent)] hover:opacity-90"
            >
              <Icon name="icon-mail" size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="text-2xl font-bold text-[var(--color-primary)]">{totalPrice}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[var(--color-border-default)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-dawn-pink-light)]"
          >
            Try for free
          </button>
          <button
            type="button"
            className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)]"
          >
            Buy Course
          </button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default CourseInfoModal;