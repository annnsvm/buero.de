import type { CatalogCourse } from '@/types/api/myLearningCourses.types';

type AccessRow = {
  course_id?: string;
  courseId?: string;
  access_type?: string;
  accessType?: string;
  trial_ends_at?: string | Date | null;
  trialEndsAt?: string | Date | null;
};

const isActiveTrial = (accessType: string | undefined, trialEndsAt: AccessRow['trial_ends_at']) => {
  if (accessType !== 'trial') return false;
  if (trialEndsAt == null || trialEndsAt === '') return true;
  return new Date(trialEndsAt).getTime() >= Date.now();
};

export const getActiveTrialCourseIdFromAccess = (rows: AccessRow[]): string | null => {
  for (const row of rows) {
    const accessType = row.access_type ?? row.accessType;
    const trialEndsAt = row.trial_ends_at ?? row.trialEndsAt;
    if (!isActiveTrial(accessType, trialEndsAt)) continue;
    const id = row.course_id ?? row.courseId;
    if (id) return String(id);
  }
  return null;
};

export const getActiveTrialCourseIdFromMyCourses = (mine: CatalogCourse[]): string | null => {
  for (const row of mine) {
    const ma = row.my_access as { access_type?: string; trial_ends_at?: string } | undefined;
    if (!ma || !isActiveTrial(ma.access_type, ma.trial_ends_at)) continue;
    return String(row.id);
  }
  return null;
};
