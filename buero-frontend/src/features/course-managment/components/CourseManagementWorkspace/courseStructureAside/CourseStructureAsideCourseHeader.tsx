import { Icon, Line } from '@/components/ui';
import React from 'react';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { CourseStructureAsideCourseHeaderProps } from '@/types/features/courseManagment/CourseStructureAside.types';

const CourseStructureAsideCourseHeader: React.FC<CourseStructureAsideCourseHeaderProps> = ({
  courseTitle,
  onSelectCourse,
  onAfterClick,
  onRequestDeleteCourse,
}) => {
  const handleSelect = () => {
    onSelectCourse();
    onAfterClick?.();
  };

  const handleDeleteClick = () => {
    onRequestDeleteCourse?.();
    onAfterClick?.();
  };

  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleDeleteClick();
  };

  return (
    <div className="pb-2">
      <p className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">
        Course
      </p>
      <div className="mt-1 flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={handleSelect}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
          aria-label="Edit course"
          className="min-w-0 flex-1 text-left"
        >
          <h3 className="text-[1.15rem] font-bold text-[var(--color-text-primary)]">
            {courseTitle?.trim() ? courseTitle.trim() : 'Untitled course'}
          </h3>
        </button>
        {onRequestDeleteCourse ? (
          <button
            type="button"
            aria-label="Delete course"
            tabIndex={0}
            onClick={handleDeleteClick}
            onKeyDown={handleDeleteKeyDown}
            className="shrink-0 rounded-lg p-2 hover:bg-[var(--color-surface-section)]"
          >
            <Icon name={ICON_NAMES.TRASH} size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        ) : null}
      </div>
      <Line />
    </div>
  );
};

export default CourseStructureAsideCourseHeader;
