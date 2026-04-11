import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

import { videoMinutesSum } from './videoMinutesSum';

export const hoursFromVideos = (modules: Modules[]): number | null => {
  const totalMinutes = videoMinutesSum(modules);
  if (totalMinutes <= 0) return null;
  return Math.ceil(totalMinutes / 60);
};
