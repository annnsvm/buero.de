import { useEffect, useLayoutEffect } from 'react';

import { ROUTES } from '@/helpers/routes';

import * as courseApi from '@/api/courseManagementApi';
import { parseApiErrorMessage } from '@/helpers/parseApiErrorMessage';
import { coverUrlFromApi } from '@/features/course-managment/domain/coverUrlFromApi';
import { mapCourseToForm } from '@/features/course-managment/domain/mapCourseToForm';
import { publishedFromApi } from '@/features/course-managment/domain/publishedFromApi';
import type { ApiCourseTreeResponse } from '@/types/features/courseManagment';
import type { UseCourseEditorEffectsParams } from '@/types/features/courseManagment/CourseEditorHooksReturn.types';

export const useCourseEditorEffects = ({
  pathname,
  routeCourseId,
  state,
  tree,
}: UseCourseEditorEffectsParams) => {
  const {
    resetEditorToEmpty,
    setIsBootstrappingCourse,
    setCreateCourseError,
    reset,
    setCourseId,
    setModules,
    setIsCoursePublished,
    setIsEditingCourse,
    setCoverFile,
    setCoverPreviewUrl,
    setLastCourseCommitKind,
  } = state;

  const { syncCourseDurationHours } = tree;

  useEffect(() => {
    const isBlankEditor =
      pathname === ROUTES.TEACHER_COURSES_CREATE || pathname === ROUTES.COURSE_MANAGEMENT;
    if (!isBlankEditor) return;
    resetEditorToEmpty();
  }, [pathname, resetEditorToEmpty]);

  useLayoutEffect(() => {
    setIsBootstrappingCourse(Boolean(routeCourseId));
  }, [routeCourseId, setIsBootstrappingCourse]);

  useEffect(() => {
    if (!routeCourseId) return;

    let cancelled = false;
    setCreateCourseError(null);

    const load = async () => {
      try {
        const res = await courseApi.fetchCourseById(routeCourseId);
        if (cancelled) return;
        const data = res.data as ApiCourseTreeResponse;
        const formValues = mapCourseToForm(data);
        reset(formValues);
        setLastCourseCommitKind(null);
        setCourseId(routeCourseId);
        setModules(data.modules ?? []);
        setIsCoursePublished(publishedFromApi(data));
        setIsEditingCourse(true);
        setCoverFile(null);
        setCoverPreviewUrl(coverUrlFromApi(data));
        await syncCourseDurationHours(routeCourseId, data.modules ?? []);
      } catch (err: unknown) {
        if (cancelled) return;
        setCreateCourseError(parseApiErrorMessage(err, 'Failed to load course'));
        setCourseId(null);
        setModules([]);
      } finally {
        if (!cancelled) setIsBootstrappingCourse(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    routeCourseId,
    reset,
    setCoverFile,
    setCoverPreviewUrl,
    setCourseId,
    setCreateCourseError,
    setIsCoursePublished,
    setIsEditingCourse,
    setModules,
    syncCourseDurationHours,
    setIsBootstrappingCourse,
    setLastCourseCommitKind,
  ]);
};
