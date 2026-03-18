import React, { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import CourseModule from '@/components/ui/CourseStructure/CourseModule/CourseModule';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

type Props = {
  modules: Modules[];
  createdCourseId: string | null;
};

const CourseStructureAside: React.FC<Props> = ({ modules, createdCourseId }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const hasStructure = modules.length > 0;

  const handleOpen = () => setIsOpenMobile(true);
  const handleClose = () => setIsOpenMobile(false);

  const EmptyState = (
    <div className="mt-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-section)] p-4">
      <p className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
        {createdCourseId ? 'No modules yet' : 'Nothing here yet'}
      </p>
      <p className="text-xs text-[var(--color-text-secondary)]">
        {createdCourseId
          ? 'Create your first module to start building the course structure.'
          : 'Create your course first, then add modules and lessons.'}
      </p>
    </div>
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

      <aside className="hidden border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:block lg:w-[320px] lg:shrink-0">
        <div className="h-full p-4">
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">Course structure</h2>
          {!hasStructure ? (
            EmptyState
          ) : (
            <ul className="mt-4 space-y-2">
              {modules.map((m) => (
                <CourseModule key={m.id} module={m} />
              ))}
            </ul>
          )}
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
          <div className="absolute top-0 left-0 h-full w-[320px] max-w-[85vw] translate-x-0 bg-[var(--color-neutral-white)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Course structure</h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-[var(--color-surface-section)]"
              >
                <Icon name={ICON_NAMES.X} size={20} ariaHidden />
              </button>
            </div>
            <div className="p-4">
              {!hasStructure ? (
                EmptyState
              ) : (
                <ul className="space-y-2">
                  {modules.map((m) => (
                    <CourseModule key={m.id} module={m} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseStructureAside;

