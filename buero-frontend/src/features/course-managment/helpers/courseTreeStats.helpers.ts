import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

/** Парсить тривалість відео у форматі `MM:SS` (хвилини:секунди) у загальну кількість секунд. */
export const parseVideoDurationMmSsToSeconds = (raw: string): number | null => {
  const match = raw.trim().match(/^(\d+):([0-5]\d)$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

/** Сума тривалостей усіх video-матеріалів у хвилинах (округлення вниз). */
export const sumVideoDurationMinutesAcrossModules = (modules: Modules[]): number => {
  let totalSeconds = 0;
  for (const moduleItem of modules) {
    for (const material of moduleItem.materials ?? []) {
      if (material.type !== 'video') continue;
      const raw =
        typeof material.content?.duration === 'string' ? material.content.duration.trim() : '';
      const seconds = parseVideoDurationMmSsToSeconds(raw);
      if (seconds != null) totalSeconds += seconds;
    }
  }
  return Math.floor(totalSeconds / 60);
};

/** Кількість матеріалів типу `video` у дереві модулів. */
export const countVideoLessonMaterials = (modules: Modules[]): number =>
  modules.reduce(
    (acc, moduleItem) =>
      acc + (moduleItem.materials ?? []).filter((material) => material.type === 'video').length,
    0,
  );

/** Усі матеріали у всіх модулях (для умови показу «Опублікувати курс»). */
export const countTotalMaterialsAcrossModules = (modules: Modules[]): number =>
  modules.reduce((acc, moduleItem) => acc + (moduleItem.materials?.length ?? 0), 0);

/**
 * Години тривалості курсу з усіх video-матеріалів (MM:SS → хв → ceil до годин).
 * Якщо відео немає або тривалості 0 — `null` (скинути duration_hours на бекенді).
 */
export const computeCourseDurationHoursFromVideoModules = (
  modules: Modules[],
): number | null => {
  const totalMinutes = sumVideoDurationMinutesAcrossModules(modules);
  if (totalMinutes <= 0) return null;
  return Math.ceil(totalMinutes / 60);
};
