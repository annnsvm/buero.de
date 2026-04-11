import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

import { parseDurationMmSs } from './parseDurationMmSs';

export const videoMinutesSum = (modules: Modules[]): number => {
  let totalSeconds = 0;
  for (const moduleItem of modules) {
    for (const material of moduleItem.materials ?? []) {
      if (material.type !== 'video') continue;
      const raw =
        typeof material.content?.duration === 'string' ? material.content.duration.trim() : '';
      const seconds = parseDurationMmSs(raw);
      if (seconds != null) totalSeconds += seconds;
    }
  }
  return Math.floor(totalSeconds / 60);
};
