import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';

import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { CourseLearningSidebar, MaterialWindow, QuizLessonModal } from '@/features/course-learning';

import type { LearningLesson } from '@/types/features/learning/LearningPage.types';
import { ROUTES } from '@/helpers/routes';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import {
  type ApiCourseWithTree,
  buildLearningLessonFromMaterial,
  findNextVideoMaterialId,
  flattenMaterialsInOrder,
  mapApiModulesToCourseStructure,
  parseQuizMaterialContent,
} from './coursePageMappers';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ApiCourseWithTree | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector(selectCurrentUser);

  const greetingName = useMemo(() => {
    if (!currentUser?.email) return 'Student';
    const local = currentUser.email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  }, [currentUser]);

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
        const firstMat = flat[0]?.material;
        setSelectedMaterialId(firstId);
        setQuizModalOpen(
          Boolean(firstMat && String(firstMat.type).toLowerCase() === 'quiz'),
        );
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

  const selectedMaterial = useMemo(
    () => flatMaterials.find((r) => r.material.id === selectedMaterialId)?.material,
    [flatMaterials, selectedMaterialId],
  );

  const isQuizSelected = Boolean(
    selectedMaterial && String(selectedMaterial.type).toLowerCase() === 'quiz',
  );

  const parsedQuizQuestions = useMemo(
    () => (selectedMaterial ? parseQuizMaterialContent(selectedMaterial) : []),
    [selectedMaterial],
  );

  const nextVideoMaterialId = useMemo(
    () => findNextVideoMaterialId(flatMaterials, selectedMaterialId),
    [flatMaterials, selectedMaterialId],
  );

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

  /** Last non-quiz material before the selected quiz — shown behind the quiz modal overlay. */
  const previousLessonBehindQuizModal: LearningLesson | undefined = useMemo(() => {
    if (!course?.title || !isQuizSelected) return undefined;
    const idx = flatMaterials.findIndex((r) => r.material.id === selectedMaterialId);
    let prevIdx = idx - 1;
    while (prevIdx >= 0) {
      const mat = flatMaterials[prevIdx]?.material;
      if (!mat) break;
      if (String(mat.type).toLowerCase() !== 'quiz') {
        return buildLearningLessonFromMaterial(
          course.title,
          mat,
          prevIdx,
          flatMaterials.length,
        );
      }
      prevIdx -= 1;
    }
    return undefined;
  }, [course?.title, flatMaterials, isQuizSelected, selectedMaterialId]);

  const handleSelectLesson = useCallback(
    (payload: { moduleId: string; materialId: string }) => {
      setSelectedMaterialId(payload.materialId);
      const mat = flatMaterials.find((r) => r.material.id === payload.materialId)?.material;
      const isQuiz = Boolean(mat && String(mat.type).toLowerCase() === 'quiz');
      setQuizModalOpen(isQuiz);
    },
    [flatMaterials],
  );

  const handleNextVideoLesson = useCallback(() => {
    if (!nextVideoMaterialId) return;
    setSelectedMaterialId(nextVideoMaterialId);
  }, [nextVideoMaterialId]);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMaterialId]);

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

      <div ref={mainScrollRef} className="min-w-0 flex-1 overflow-y-auto">
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
          {flatMaterials.length === 0 ? (
            <div className="flex justify-center p-8 text-[var(--color-text-secondary)]">
              No lessons in this course yet.
            </div>
          ) : null}
          {flatMaterials.length > 0 && currentLesson && !isQuizSelected ? (
            <MaterialWindow
              lesson={currentLesson}
              hasNextVideoLesson={Boolean(nextVideoMaterialId)}
              onNextVideoLesson={handleNextVideoLesson}
            />
          ) : null}
          {flatMaterials.length > 0 && isQuizSelected && quizModalOpen && previousLessonBehindQuizModal ? (
            <MaterialWindow lesson={previousLessonBehindQuizModal} hasNextVideoLesson={false} />
          ) : null}
          {flatMaterials.length > 0 && isQuizSelected && !quizModalOpen ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 pt-28 text-center">
              <p className="max-w-md text-lg font-medium text-[var(--color-text-primary)]">
                {selectedMaterial?.title ?? 'Quiz'}
              </p>
              <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
                Open the quiz to answer the questions for this lesson.
              </p>
              <button
                type="button"
                onClick={() => setQuizModalOpen(true)}
                className="rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Open quiz
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {selectedMaterial && isQuizSelected ? (
        <QuizLessonModal
          isOpen={quizModalOpen}
          onOpenChange={setQuizModalOpen}
          greetingName={greetingName}
          quizMaterialTitle={selectedMaterial.title || 'Quiz'}
          questions={parsedQuizQuestions}
        />
      ) : null}
    </div>
  );
};

export default CoursePage;
