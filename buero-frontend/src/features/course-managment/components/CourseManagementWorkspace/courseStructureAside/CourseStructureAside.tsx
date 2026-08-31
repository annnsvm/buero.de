import React, { useCallback, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useSlideInSheet } from '@/hooks/useSlideInSheet';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type { CourseStructureAsideProps } from '@/types/features/courseManagment/CourseStructureAside.types';
import CourseStructureAsideCourseHeader from './CourseStructureAsideCourseHeader';
import CourseStructureAsideActionButton from './CourseStructureAsideActionButton';
import CourseStructureAsideEmptyState from './CourseStructureAsideEmptyState';
import SortableCourseModule from './SortableCourseModule';
import { getStructureDragData, toModuleSortableId } from './courseStructureDnd.ids';
import { Button, Logo } from '@/components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';
import { WorkspaceScrollArea } from '@/components/modal';

const cloneModules = (modules: Modules[]): Modules[] =>
  modules.map((mod) => ({ ...mod, materials: [...mod.materials] }));

const findModuleIdByMaterial = (modules: Modules[], materialId: string): string | undefined =>
  modules.find((mod) => mod.materials.some((material) => material.id === materialId))?.id;

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
  showUnpublishCourseButton,
  onRequestUnpublishCourse,
  courseStructureMobileOpen,
  onCourseStructureMobileChange,
  hideMobileFloatingStructureButton = false,
  onDraftStructureChange,
  hasUnsavedStructure = false,
}) => {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [forceExpandedModuleId, setForceExpandedModuleId] = useState<string | null>(null);
  const isControlled =
    courseStructureMobileOpen !== undefined && onCourseStructureMobileChange !== undefined;
  const isOpenMobile = isControlled ? courseStructureMobileOpen! : internalMobileOpen;
  const setIsOpenMobile = isControlled ? onCourseStructureMobileChange! : setInternalMobileOpen;
  const { mounted: sheetMounted, entered: sheetEntered } = useSlideInSheet(isOpenMobile);
  const hasStructure = modules.length > 0;
  const hasCourse = courseId != null;
  const dragEnabled = Boolean(hasCourse && onDraftStructureChange);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const handleRequestUnpublish = () => {
    onRequestUnpublishCourse?.();
  };

  const handleUnpublishKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleRequestUnpublish();
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = getStructureDragData(event.active.data.current);
    if (data?.type === 'material') setForceExpandedModuleId(data.moduleId);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!dragEnabled || !onDraftStructureChange) return;
      const { active, over } = event;
      if (!over) return;

      const activeData = getStructureDragData(active.data.current);
      const overData = getStructureDragData(over.data.current);
      if (activeData?.type !== 'material') return;

      const overModuleId =
        overData?.type === 'material' || overData?.type === 'module' || overData?.type === 'module-drop'
          ? overData.moduleId
          : undefined;
      if (!overModuleId) return;
      setForceExpandedModuleId(overModuleId);

      const fromModuleId = findModuleIdByMaterial(modules, activeData.materialId);
      if (!fromModuleId || fromModuleId === overModuleId) return;

      const next = cloneModules(modules);
      const fromModule = next.find((mod) => mod.id === fromModuleId);
      const toModule = next.find((mod) => mod.id === overModuleId);
      if (!fromModule || !toModule) return;

      const fromIndex = fromModule.materials.findIndex((item) => item.id === activeData.materialId);
      if (fromIndex < 0) return;
      const [moved] = fromModule.materials.splice(fromIndex, 1);
      if (!moved) return;

      let insertIndex = toModule.materials.length;
      if (overData?.type === 'material') {
        const overIndex = toModule.materials.findIndex((item) => item.id === overData.materialId);
        if (overIndex >= 0) insertIndex = overIndex;
      }
      toModule.materials.splice(insertIndex, 0, moved);
      onDraftStructureChange(next);
    },
    [dragEnabled, modules, onDraftStructureChange],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setForceExpandedModuleId(null);
      if (!dragEnabled || !onDraftStructureChange) return;

      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeData = getStructureDragData(active.data.current);
      const overData = getStructureDragData(over.data.current);
      if (!activeData) return;

      if (activeData.type === 'module') {
        const overModuleId =
          overData?.type === 'module' || overData?.type === 'module-drop' || overData?.type === 'material'
            ? overData.moduleId
            : undefined;
        if (!overModuleId) return;
        const oldIndex = modules.findIndex((mod) => mod.id === activeData.moduleId);
        const newIndex = modules.findIndex((mod) => mod.id === overModuleId);
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;
        onDraftStructureChange(arrayMove(modules, oldIndex, newIndex));
        return;
      }

      const materialId = activeData.materialId;
      const currentModuleId = findModuleIdByMaterial(modules, materialId);
      const overModuleId =
        overData?.type === 'material' || overData?.type === 'module' || overData?.type === 'module-drop'
          ? overData.moduleId
          : currentModuleId;
      if (!currentModuleId || !overModuleId) return;

      if (currentModuleId === overModuleId && overData?.type === 'material') {
        const next = cloneModules(modules);
        const target = next.find((mod) => mod.id === currentModuleId);
        if (!target) return;
        const oldIndex = target.materials.findIndex((item) => item.id === materialId);
        const newIndex = target.materials.findIndex((item) => item.id === overData.materialId);
        if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
          target.materials = arrayMove(target.materials, oldIndex, newIndex);
          onDraftStructureChange(next);
        }
        return;
      }

      onDraftStructureChange(modules);
    },
    [dragEnabled, modules, onDraftStructureChange],
  );

  const handleDragCancel = useCallback(() => {
    setForceExpandedModuleId(null);
  }, []);

  const renderStructureList = () => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={modules.map((mod) => toModuleSortableId(mod.id))}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {modules.map((mod, index) => (
            <SortableCourseModule
              key={mod.id}
              module={mod}
              displayPosition={index + 1}
              dragEnabled={dragEnabled}
              forceExpanded={forceExpandedModuleId === mod.id}
              onCreateMaterial={onCreateMaterial}
              onEditModule={onEditModule}
              onSelectMaterial={onSelectMaterial}
              onRequestDeleteModule={onRequestDeleteModule}
              onRequestDeleteMaterial={onRequestDeleteMaterial}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );

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
          {hasUnsavedStructure ? (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              New order is not saved yet. Open the course and click Save changes, then Confirm.
            </p>
          ) : null}
        </div>
      ) : null}

      {!hasStructure ? (
        <CourseStructureAsideEmptyState hasCourse={hasCourse} />
      ) : (
        <div className={isMobile ? '' : 'mt-4'}>{renderStructureList()}</div>
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
        {showUnpublishCourseButton && onRequestUnpublishCourse ? (
          <Button
            type="button"
            variant="outlineDark"
            className="w-full"
            onClick={handleRequestUnpublish}
            onKeyDown={handleUnpublishKeyDown}
            aria-label="Unpublish course"
          >
            Unpublish course
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <>
      {!hideMobileFloatingStructureButton ? (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={handleOpen}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
            aria-label="Open course structure"
            className="fixed top-[4rem] left-4 z-40 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] px-3 py-2 shadow-sm"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
              <Icon name={ICON_NAMES.BOOK} size={18} ariaHidden />
              Course Structure
            </span>
          </button>
        </div>
      ) : null}

      <aside className="hidden h-full min-h-0 w-[320px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-neutral-white)] lg:flex">
        <div className="shrink-0 px-26 py-8">
          <Link to={ROUTES.HOME}>
            <Logo isLight={false} width={70} height={28} />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col pl-4 pt-4 pb-4 pr-0">
          <h2 className="shrink-0 pr-4 text-base font-bold text-[var(--color-text-primary)]">
            Course structure
          </h2>
          <WorkspaceScrollArea className="mt-2 flex min-h-0 flex-1 flex-col">
            <div className="pr-2">{renderScrollableBody(false)}</div>
          </WorkspaceScrollArea>
          <div className="pr-4">{renderFooter(false)}</div>
        </div>
      </aside>

      {sheetMounted ? (
        <div className="pointer-events-none fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close course structure"
            onClick={handleClose}
            className={[
              'pointer-events-auto absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out',
              sheetEntered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
          <div
            className={[
              'pointer-events-auto absolute top-0 left-0 z-10 flex h-full max-h-[100vh] w-[320px] max-w-[85vw] flex-col bg-[var(--color-neutral-white)] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform',
              sheetEntered ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
              <Link to={ROUTES.HOME} className="px-10 py-4">
                <Logo isLight={false} width={70} height={28} />
              </Link>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md ring-1 ring-black/10 transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                <Icon name={ICON_NAMES.X} size={22} className="text-white" ariaHidden />
              </button>
            </div>
            <h2 className="shrink-0 px-4 pt-2 text-base font-bold text-[var(--color-text-primary)]">
              Course structure
            </h2>
            <WorkspaceScrollArea className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="pl-4 pr-2 pb-2">{renderScrollableBody(true)}</div>
            </WorkspaceScrollArea>
            <div className="shrink-0 px-4 pb-4">{renderFooter(true)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CourseStructureAside;
