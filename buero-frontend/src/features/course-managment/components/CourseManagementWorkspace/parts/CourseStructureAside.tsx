import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import CourseModule from '@/components/ui/CourseStructure/CourseModule/CourseModule';
import type { CourseStructureAsideProps } from '@/types/features/courseManagment/CourseStructureAside.types';
import CourseStructureAsideCourseHeader from './CourseStructureAsideCourseHeader';
import CourseStructureAsideActionButton from './CourseStructureAsideActionButton';
import CourseStructureAsideEmptyState from './CourseStructureAsideEmptyState';

const CourseStructureAside: React.FC<CourseStructureAsideProps> = ({
  modules,
  courseId,
  courseTitle,
  onSelectCourse,
  onCreateModule,
  onEditModule,
  onCreateMaterial,
  onSelectMaterial,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const hasStructure = modules.length > 0;
  const hasCourse = courseId != null;

  const handleOpen = () => setIsOpenMobile(true);
  const handleClose = () => setIsOpenMobile(false);

  const renderAsideContent = (isMobile: boolean) => (
    <>
      {hasCourse ? (
        <div className={isMobile ? 'mb-4' : 'mt-4'}>
          <CourseStructureAsideCourseHeader
            courseTitle={courseTitle}
            onSelectCourse={onSelectCourse}
            onAfterClick={isMobile ? handleClose : undefined}
          />
        </div>
      ) : null}

      {!hasStructure ? (
        <CourseStructureAsideEmptyState hasCourse={hasCourse} />
      ) : (
        <ul className={isMobile ? 'space-y-2' : 'mt-4 space-y-2'}>
          {modules.map((m) => (
            <CourseModule
              key={m.id}
              module={m}
              onCreateMaterial={onCreateMaterial}
              onEditModule={onEditModule}
              onSelectMaterial={onSelectMaterial}
            />
          ))}
        </ul>
      )}

      {hasCourse ? (
        <div className="mt-4">
          <CourseStructureAsideActionButton
            label="Add module"
            ariaLabel="Add module"
            onClick={onCreateModule}
            onAfterClick={isMobile ? handleClose : undefined}
          />
        </div>
      ) : null}
    </>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={handleOpen}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
          aria-label="Open course structure"
          className="fixed top-[2.25rem] left-4 z-40 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] px-3 py-2 shadow-sm"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
            <Icon name={ICON_NAMES.BOOK} size={18} ariaHidden />
            Course Structure
          </span>
        </button>
      </div>

      <aside className="hidden h-full overflow-y-auto border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:block lg:w-[320px] lg:shrink-0">
        <div className="min-h-full p-4">
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">Course structure</h2>
          {renderAsideContent(false)}
        </div>
      </aside>

      {isOpenMobile ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close course structure"
            onClick={handleClose}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute top-0 left-0 h-full w-[320px] max-w-[85vw] translate-x-0 overflow-y-auto bg-[var(--color-neutral-white)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                Course structure
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-[var(--color-surface-section)]"
              >
                <Icon name={ICON_NAMES.X} size={20} ariaHidden />
              </button>
            </div>
            <div className="p-4">{renderAsideContent(true)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseStructureAside;
