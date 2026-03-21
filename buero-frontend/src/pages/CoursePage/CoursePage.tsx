import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { CourseLearningSidebar, MaterialWindow } from '@/features/course-learning';

import type { LearningLesson } from '@/types/features/learning/LearningPage.types';
import { ROUTES } from '@/helpers/routes';
import {
  type ApiCourseWithTree,
  buildLearningLessonFromMaterial,
  flattenMaterialsInOrder,
  mapApiModulesToCourseStructure,
} from './coursePageMappers';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ApiCourseWithTree | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;
    const load = async () => {
      setLoadStatus('loading');
      setLoadError(null);
      try {
        const { data } = await apiInstance.get<ApiCourseWithTree>(API_ENDPOINTS.courses.byId(courseId));
        if (cancelled) return;
        setCourse(data);
        const flat = flattenMaterialsInOrder(data);
        const firstId = flat[0]?.material.id ?? null;
        setSelectedMaterialId(firstId);
        setLoadStatus('idle');
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err && typeof err === 'object' && 'response' in err
            ? String((err as { response?: { data?: { message?: unknown } } }).response?.data?.message ?? '')
            : err instanceof Error
              ? err.message
              : 'Failed to load course';
        setLoadError(message || 'Failed to load course');
        setLoadStatus('error');
        setCourse(null);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const structureModules = useMemo(
    () => mapApiModulesToCourseStructure(course?.modules),
    [course?.modules],
  );

  const flatMaterials = useMemo(() => (course ? flattenMaterialsInOrder(course) : []), [course]);

  const currentLesson: LearningLesson | undefined = useMemo(() => {
    if (!course?.title) return undefined;
    const idx = flatMaterials.findIndex((r) => r.material.id === selectedMaterialId);
    const ref = idx >= 0 ? flatMaterials[idx] : flatMaterials[0];
    if (!ref) return undefined;
    return buildLearningLessonFromMaterial(
      course.title,
      ref.material,
      idx >= 0 ? idx : 0,
      flatMaterials.length,
    );
  }, [course, flatMaterials, selectedMaterialId]);

  const handleSelectLesson = useCallback((payload: { moduleId: string; materialId: string }) => {
    setSelectedMaterialId(payload.materialId);
  }, []);

  if (!courseId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-white)]">
        <p className="text-[var(--color-text-secondary)]">Course id is missing.</p>
      </div>
    );
  }

  if (loadStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-neutral-white)]">
        <p className="text-[var(--color-text-secondary)]">Loading course…</p>
      </div>
    );
  }

  if (loadStatus === 'error' || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[var(--color-neutral-white)] px-4">
        <p className="text-center text-[var(--color-error)]">{loadError ?? 'Course not found.'}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
      <CourseLearningSidebar
        modules={structureModules}
        onSelectLesson={handleSelectLesson}
        selectedMaterialId={selectedMaterialId}
      />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="fixed top-0 z-10 flex gap-4 w-full justify-center border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)] px-4 py-6 lg:justify-start lg:px-10">
          <button
           type="button"
            className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
          >
            Vocabulary
          </button>
          <NavLink
            to={ROUTES.COURSES}
            className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
          >
            All courses
          </NavLink>
        </div>

        <section
          className="min-w-0 flex-1 bg-[var(--color-soapstone-base)]"
          aria-label="Lesson content"
        >
          {currentLesson ? (
            <MaterialWindow lesson={currentLesson} />
          ) : (
            <div className="flex justify-center p-8 text-[var(--color-text-secondary)]">
              No lessons in this course yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CoursePage;
