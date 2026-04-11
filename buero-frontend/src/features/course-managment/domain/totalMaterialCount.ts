import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export const totalMaterialCount = (modules: Modules[]): number =>
  modules.reduce((acc, moduleItem) => acc + (moduleItem.materials?.length ?? 0), 0);
