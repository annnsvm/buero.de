const isActiveTrialRow = (row: Record<string, unknown>): boolean => {
  const accessType = String(row.accessType ?? row.access_type ?? '');
  if (accessType !== 'trial') return false;
  const trialEnd = row.trialEndsAt ?? row.trial_ends_at;
  if (trialEnd == null || trialEnd === '') return true;
  return new Date(String(trialEnd)).getTime() >= Date.now();
};

export const getActiveTrialCourseIdFromAccessList = (accessList: unknown[]): string | null => {
  for (const raw of accessList) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    if (!isActiveTrialRow(row)) continue;
    const cid =
      typeof row.courseId === 'string'
        ? row.courseId
        : typeof row.course_id === 'string'
          ? row.course_id
          : null;
    if (cid) return cid;
  }
  return null;
};

export const userHasAccessToCourse = (accessList: unknown[], courseId: string): boolean => {
  const now = Date.now();
  for (const raw of accessList) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    const cid =
      typeof row.courseId === 'string'
        ? row.courseId
        : typeof row.course_id === 'string'
          ? row.course_id
          : null;
    if (cid !== courseId) continue;

    const accessType = String(row.accessType ?? row.access_type ?? '');

    if (accessType === 'trial') {
      const trialEnd = row.trialEndsAt ?? row.trial_ends_at;
      if (trialEnd == null) return true;
      return new Date(String(trialEnd)).getTime() >= now;
    }
    if (accessType === 'purchase' || accessType === 'subscription') {
      return true;
    }
  }
  return false;
};
