import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import Icon from '../../Icon';
import ModuleMaterial from '../ModuleMaterial/ModuleMaterial';
import { ICON_NAMES } from '@/helpers/iconNames';
import { ModuleMaterialType, ModulesProps } from '@/types/components/ui/ModuleMaterial.types';
import CourseStructureAsideActionButton from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside/CourseStructureAsideActionButton';

const CourseModule: React.FC<ModulesProps> = ({
  module,
  onCreateMaterial,
  onSelectMaterial,
  onEditModule,
  onRequestDeleteModule,
  onRequestDeleteMaterial,
  displayPosition,
  dragHandleProps,
  isDragging = false,
  forceExpanded = false,
  setDropTargetRef,
  renderMaterialsList,
  sortableRef,
  sortableStyle,
}) => {
  const { id, title, orderIndex, materials } = module;
  const [isExpanded, setIsExpanded] = useState(false);

  const expanded = isExpanded || forceExpanded;
  const moduleNumber = displayPosition ?? (orderIndex ?? 0) + 1;

  return (
    <li ref={sortableRef} style={sortableStyle} className={isDragging ? 'z-10 opacity-80' : undefined}>
      <div ref={setDropTargetRef} className="rounded-lg bg-[var(--color-surface-card)]">
        <div className="flex items-center gap-2 px-4 py-3">
          {dragHandleProps ? (
            <button
              type="button"
              {...dragHandleProps}
              className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded-lg p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex min-w-0 flex-1 items-center justify-between text-left"
          >
            <div>
              <div className="flex flex-col font-bold text-[var(--color-text-primary)]">
                <span className="text-[var(--color-text-secondary)]">MODULE {moduleNumber}</span>
                <span>{title}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {materials.length} lessons
              </p>
            </div>
            <Icon
              name={expanded ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN}
              size={20}
              className="text-[var(--color-text-secondary)]"
            />
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Edit module ${title}`}
              onClick={() => onEditModule(id, title)}
              className="rounded p-1 hover:bg-[var(--color-surface-section)]"
            >
              <Icon name={ICON_NAMES.EDIT} size={16} className="text-[var(--color-text-secondary)]" />
            </button>
            {onRequestDeleteModule ? (
              <button
                type="button"
                aria-label={`Delete module ${title}`}
                tabIndex={0}
                onClick={() => onRequestDeleteModule(id, title)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  onRequestDeleteModule(id, title);
                }}
                className="rounded p-1 hover:bg-[var(--color-surface-section)]"
              >
                <Icon name={ICON_NAMES.TRASH} size={16} className="text-[var(--color-text-secondary)]" />
              </button>
            ) : null}
          </div>
        </div>
        {expanded ? (
          <div className="px-4 pb-4">
            {materials.length > 0 ? (
              <ul className="mt-2 space-y-2 pl-4">
                {renderMaterialsList
                  ? renderMaterialsList()
                  : materials.map((material: ModuleMaterialType) => (
                      <ModuleMaterial
                        key={material.id}
                        material={material}
                        onSelectMaterial={(materialId) => onSelectMaterial(id, materialId)}
                        onRequestDeleteMaterial={
                          onRequestDeleteMaterial
                            ? (materialId) => onRequestDeleteMaterial(id, materialId)
                            : undefined
                        }
                      />
                    ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                No materials yet. Add the first material to this module.
              </p>
            )}
            <CourseStructureAsideActionButton
              label="Add material"
              ariaLabel="Add material"
              onClick={() => onCreateMaterial(id)}
              className="mt-3"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default CourseModule;
