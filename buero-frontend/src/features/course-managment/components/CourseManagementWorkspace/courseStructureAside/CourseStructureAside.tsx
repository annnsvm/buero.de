import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import CourseModule from '@/components/ui/CourseStructure/CourseModule/CourseModule';
import type { CourseStructureAsideProps } from '@/types/features/courseManagment/CourseStructureAside.types';
import CourseStructureAsideCourseHeader from './CourseStructureAsideCourseHeader';
import CourseStructureAsideActionButton from './CourseStructureAsideActionButton';
import CourseStructureAsideEmptyState from './CourseStructureAsideEmptyState';
import { Button, Logo } from '@/components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';

const CourseStructureAside: React.FC<CourseStructureAsideProps> = ({
  modules,
  courseId,
  courseTitle,
  onSelectCourse,
  onCreateModule,
  onEditModule,
  onCreateMaterial,
  onSelectMaterial,
  onRequestDeleteCourse,
  onRequestDeleteModule,
  onRequestDeleteMaterial,
  showPublishCourseButton,
  onRequestPublishCourse,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const hasStructure = modules.length > 0;
  const hasCourse = courseId != null;

  const handleOpen = () => setIsOpenMobile(true);
  const handleClose = () => setIsOpenMobile(false);

  const handleRequestPublish = () => {
    onRequestPublishCourse?.();
  };

  const handlePublishKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleRequestPublish();
  };

  const renderScrollableBody = (isMobile: boolean) => (
    <>
      {hasCourse ? (
        <div className={isMobile ? 'mb-4' : ''}>
          <CourseStructureAsideCourseHeader
            courseTitle={courseTitle}
            onSelectCourse={onSelectCourse}
            onAfterClick={isMobile ? handleClose : undefined}
            onRequestDeleteCourse={onRequestDeleteCourse}
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
              onRequestDeleteModule={onRequestDeleteModule}
              onRequestDeleteMaterial={onRequestDeleteMaterial}
            />
          ))}
        </ul>
      )}
    </>
  );

  const renderFooter = (isMobile: boolean) => {
    if (!hasCourse) return null;
    return (
      <div className="mt-4 shrink-0 space-y-3">
        <CourseStructureAsideActionButton
          label="Add module"
          ariaLabel="Add module"
          onClick={onCreateModule}
          onAfterClick={isMobile ? handleClose : undefined}
        />
        {showPublishCourseButton && onRequestPublishCourse ? (
          <Button
            type="button"
            variant="solid"
            className="w-full"
            onClick={handleRequestPublish}
            onKeyDown={handlePublishKeyDown}
            aria-label="Publish course"
          >
            Publish course
          </Button>
        ) : null}
      </div>
    );
  };

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

      <aside className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex">
        <div className="shrink-0 px-26 py-4">
          <Link to={ROUTES.HOME}>
            <Logo isLight={false} width={100} height={30} />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <h2 className="shrink-0 text-base font-bold text-[var(--color-text-primary)]">
            Course structure
          </h2>
          <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {renderScrollableBody(false)}
          </div>
          {renderFooter(false)}
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
          <div className="absolute top-0 left-0 flex h-full max-h-[100vh] w-[320px] max-w-[85vw] flex-col bg-[var(--color-neutral-white)] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <Link to={ROUTES.HOME} className="px-10 py-4">
                <Logo isLight={false} width={100} height={30} />
              </Link>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="w-8 shrink-0 rounded-full p-2 hover:bg-[var(--color-surface-section)]"
              >
                <Icon name={ICON_NAMES.X} size={30} ariaHidden />
              </button>
            </div>
            <h2 className="shrink-0 px-4 pt-2 text-base font-bold text-[var(--color-text-primary)]">
              Course structure
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2">
              {renderScrollableBody(true)}
            </div>
            <div className="shrink-0 px-4 pb-4">{renderFooter(true)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseStructureAside;
