import { useCallback } from 'react';

import * as courseApi from '@/api/courseManagementApi';
import { hoursFromVideos } from '@/features/course-managment/domain/hoursFromVideos';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type { UseCourseEditorTreeParams } from '@/types/features/courseManagment/CourseEditorHookParams.types';

export const useCourseEditorTree = ({
  setValue,
  setModules,
  setIsCoursePublished,
}: UseCourseEditorTreeParams) => {  const syncCourseDurationHours = useCallback(
    async (cid: string, nextModules: Modules[]) => {
      const hours = hoursFromVideos(nextModules);
      try {
        await courseApi.patchCourse(cid, {
          duration_hours: hours ?? null,
        });
        setValue('durationHours', hours === null ? '' : String(hours), { shouldDirty: false });
      } catch {
      }
    },
    [setValue],
  );

  const fetchCourseTree = useCallback(
    async (id: string) => {
      const res = await courseApi.fetchCourseById(id);
      const mods = res.data.modules ?? [];
      setModules(mods);
      const published = res.data.is_published ?? res.data.isPublished ?? false;
      setIsCoursePublished(published === true);
      await syncCourseDurationHours(id, mods);
    },
    [syncCourseDurationHours, setModules, setIsCoursePublished],
  );

  return { syncCourseDurationHours, fetchCourseTree };
};