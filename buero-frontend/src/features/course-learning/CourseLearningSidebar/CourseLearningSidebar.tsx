import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { courseStructureKeyFromModules } from '@/features/courses-catalog/courseStructure.helpers';
import CourseStructure from '@/features/courses-catalog/CourseStructure';
import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ROUTES } from '@/helpers/routes';
import TrialSidebarBlurTail from './TrialSidebarBlurTail';

export type CourseLearningSidebarProps = {
  modules: CourseModule[];
  onSelectLesson: (payload: { moduleId: string; materialId: string }) => void;
  selectedMaterialId: string | null;
  completedMaterialIds?: ReadonlySet<string>;
  lockedModuleIds?: ReadonlySet<string>;
  /** Якщо є заблоковані модулі (trial), показуємо CTA на повний курс. */
  checkoutCourseId?: string;
};

const CourseLearningSidebar: React.FC<CourseLearningSidebarProps> = ({
  modules,
  onSelectLesson,
  selectedMaterialId,
  completedMaterialIds,
  lockedModuleIds,
  checkoutCourseId,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleOpen = () => setIsOpenMobile(true);
  const handleClose = () => setIsOpenMobile(false);

  const handleLessonSelect = (payload: { moduleId: string; materialId: string }) => {
    onSelectLesson(payload);
    handleClose();
  };

  const trialOutline =
    Boolean(checkoutCourseId) && Boolean(lockedModuleIds && lockedModuleIds.size > 0);

  const displayModules = useMemo(() => {
    if (!trialOutline) return modules;
    const sorted = [...modules].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    return sorted.slice(0, 1);
  }, [modules, trialOutline]);

  const nextLockedModulePreview = useMemo(() => {
    const sorted = [...modules].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    const second = sorted[1];
    if (!second) return null;
    return { title: second.title, materialCount: second.materials?.length ?? 0 };
  }, [modules]);

  const structureKey = courseStructureKeyFromModules(displayModules);

  const renderStructure = (isMobile: boolean) => {
    const inner = (
      <>
        <CourseStructure
          key={structureKey}
          modules={displayModules}
          onSelectLesson={isMobile ? handleLessonSelect : onSelectLesson}
          selectedMaterialId={selectedMaterialId}
          completedMaterialIds={completedMaterialIds}
        />
        {trialOutline && checkoutCourseId ? (
          <TrialSidebarBlurTail
            courseId={checkoutCourseId}
            previewModule={nextLockedModulePreview}
          />
        ) : null}
      </>
    );

    if (!trialOutline) return inner;

    return <div className="flex min-h-full flex-1 flex-col">{inner}</div>;
  };

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen();
          }}
          aria-label="Open course structure"
          aria-expanded={isOpenMobile}
          className="fixed top-[4rem] left-4 z-40 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] px-3 py-2 shadow-sm"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
            <Icon name={ICON_NAMES.BOOK} size={18} ariaHidden />
            Course Structure
          </span>
        </button>
      </div>

      <aside
        className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex"
        aria-label="Course outline"
      >
        <div className="shrink-0 px-6 py-6">
          <Link to={ROUTES.HOME}>
            <Logo isLight={false} width={70} height={28} />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-4">
            {renderStructure(false)}
          </div>
        </div>
      </aside>

      {isOpenMobile ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Course structure">
          <button
            type="button"
            aria-label="Close course structure"
            onClick={handleClose}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute top-0 left-0 flex h-full max-h-[100vh] w-[320px] max-w-[85vw] flex-col bg-[var(--color-neutral-white)] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <Link to={ROUTES.HOME} className="px-4 py-8">
                <Logo isLight={false} width={70} height={28} />
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
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-4">
              {renderStructure(true)}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseLearningSidebar;
