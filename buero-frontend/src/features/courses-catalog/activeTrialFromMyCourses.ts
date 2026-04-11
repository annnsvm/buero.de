import type { CatalogCourse } from '@/types/api/myLearningCourses.types';

export const getActiveTrialCourseIdFromMyCourses = (mine: CatalogCourse[]): string | null => {
  const now = Date.now();
  for (const row of mine) {
    const ma = row.my_access as { access_type?: string; trial_ends_at?: string } | undefined;
    if (!ma || ma.access_type !== 'trial') continue;
    const end = ma.trial_ends_at;
    if (end != null && end !== '' && new Date(end).getTime() < now) continue;
    return String(row.id);
  }
  return null;
};
