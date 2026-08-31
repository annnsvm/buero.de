export const MODULE_SORTABLE_PREFIX = 'module:';
export const MATERIAL_SORTABLE_PREFIX = 'material:';
export const MODULE_DROP_PREFIX = 'module-drop:';

export const toModuleSortableId = (id: string) => `${MODULE_SORTABLE_PREFIX}${id}`;
export const toMaterialSortableId = (id: string) => `${MATERIAL_SORTABLE_PREFIX}${id}`;
export const toModuleDroppableId = (id: string) => `${MODULE_DROP_PREFIX}${id}`;

export type StructureDragData =
  | { type: 'module'; moduleId: string }
  | { type: 'material'; moduleId: string; materialId: string }
  | { type: 'module-drop'; moduleId: string };

export const getStructureDragData = (value: unknown): StructureDragData | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const data = value as Partial<StructureDragData>;
  if (data.type === 'module' && typeof data.moduleId === 'string') {
    return { type: 'module', moduleId: data.moduleId };
  }
  if (
    data.type === 'material' &&
    typeof data.moduleId === 'string' &&
    typeof (data as { materialId?: unknown }).materialId === 'string'
  ) {
    return {
      type: 'material',
      moduleId: data.moduleId,
      materialId: (data as { materialId: string }).materialId,
    };
  }
  if (data.type === 'module-drop' && typeof data.moduleId === 'string') {
    return { type: 'module-drop', moduleId: data.moduleId };
  }
  return undefined;
};
