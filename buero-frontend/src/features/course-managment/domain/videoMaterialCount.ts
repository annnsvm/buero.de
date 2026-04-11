import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export const videoMaterialCount = (modules: Modules[]): number =>
  modules.reduce(
    (acc, moduleItem) =>
      acc + (moduleItem.materials ?? []).filter((material) => material.type === 'video').length,
    0,
  );
