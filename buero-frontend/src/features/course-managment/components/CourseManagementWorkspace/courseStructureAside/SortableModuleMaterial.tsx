import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import ModuleMaterial from '@/components/ui/CourseStructure/ModuleMaterial/ModuleMaterial';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

import { toMaterialSortableId } from './courseStructureDnd.ids';

type SortableModuleMaterialProps = {
  moduleId: string;
  material: ModuleMaterialType;
  dragEnabled: boolean;
  onSelectMaterial: (moduleId: string, materialId: string) => void;
  onRequestDeleteMaterial?: (moduleId: string, materialId: string) => void;
};

const SortableModuleMaterial = ({
  moduleId,
  material,
  dragEnabled,
  onSelectMaterial,
  onRequestDeleteMaterial,
}: SortableModuleMaterialProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toMaterialSortableId(material.id),
    disabled: !dragEnabled,
    data: { type: 'material', moduleId, materialId: material.id },
  });

  const dragHandleProps = dragEnabled
    ? {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
        'aria-label': `Drag lesson ${material.title || 'Untitled material'}`,
      }
    : undefined;

  return (
    <ModuleMaterial
      material={material}
      sortableRef={setNodeRef}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      isDragging={isDragging}
      dragHandleProps={dragHandleProps}
      onSelectMaterial={(materialId) => onSelectMaterial(moduleId, materialId)}
      onRequestDeleteMaterial={
        onRequestDeleteMaterial
          ? (materialId) => onRequestDeleteMaterial(moduleId, materialId)
          : undefined
      }
    />
  );
};

export default SortableModuleMaterial;
