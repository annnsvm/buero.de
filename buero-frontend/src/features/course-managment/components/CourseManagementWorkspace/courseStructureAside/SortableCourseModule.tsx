import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import CourseModule from '@/components/ui/CourseStructure/CourseModule/CourseModule';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

import {
  toMaterialSortableId,
  toModuleDroppableId,
  toModuleSortableId,
} from './courseStructureDnd.ids';
import SortableModuleMaterial from './SortableModuleMaterial';

type SortableCourseModuleProps = {
  module: Modules;
  displayPosition: number;
  dragEnabled: boolean;
  forceExpanded: boolean;
  onCreateMaterial: (moduleId: string) => void;
  onEditModule: (moduleId: string, moduleTitle: string) => void;
  onSelectMaterial: (moduleId: string, materialId: string) => void;
  onRequestDeleteModule?: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteMaterial?: (moduleId: string, materialId: string) => void;
};

const SortableCourseModule = ({
  module,
  displayPosition,
  dragEnabled,
  forceExpanded,
  onCreateMaterial,
  onEditModule,
  onSelectMaterial,
  onRequestDeleteModule,
  onRequestDeleteMaterial,
}: SortableCourseModuleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toModuleSortableId(module.id),
    disabled: !dragEnabled,
    data: { type: 'module', moduleId: module.id },
  });

  const { setNodeRef: setDropTargetRef } = useDroppable({
    id: toModuleDroppableId(module.id),
    disabled: !dragEnabled,
    data: { type: 'module-drop', moduleId: module.id },
  });

  const dragHandleProps = dragEnabled
    ? {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
        'aria-label': `Drag module ${module.title}`,
      }
    : undefined;

  return (
    <CourseModule
      module={module}
      displayPosition={displayPosition}
      sortableRef={setNodeRef}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      isDragging={isDragging}
      forceExpanded={forceExpanded}
      setDropTargetRef={setDropTargetRef}
      dragHandleProps={dragHandleProps}
      onCreateMaterial={onCreateMaterial}
      onEditModule={onEditModule}
      onSelectMaterial={onSelectMaterial}
      onRequestDeleteModule={onRequestDeleteModule}
      onRequestDeleteMaterial={onRequestDeleteMaterial}
      renderMaterialsList={() => (
        <SortableContext
          items={module.materials.map((item) => toMaterialSortableId(item.id))}
          strategy={verticalListSortingStrategy}
        >
          {module.materials.map((material) => (
            <SortableModuleMaterial
              key={material.id}
              moduleId={module.id}
              material={material}
              dragEnabled={dragEnabled}
              onSelectMaterial={onSelectMaterial}
              onRequestDeleteMaterial={onRequestDeleteMaterial}
            />
          ))}
        </SortableContext>
      )}
    />
  );
};

export default SortableCourseModule;
