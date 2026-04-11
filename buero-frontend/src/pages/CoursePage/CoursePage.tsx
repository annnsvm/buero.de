import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';

import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { completeCourseMaterial, fetchCourseProgress } from '@/api/progressApi';
import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import { CourseLearningSidebar, MaterialWindow, QuizLessonModal } from '@/features/course-learning';
import type { QuizResultSummary } from '@/features/course-learning/QuizLessonModal';

import type { LearningLesson } from '@/types/features/learning/LearningPage.types';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { ROUTES } from '@/helpers/routes';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import useModal from '@/components/modal/context/useModal';
import {
  type ApiCourseWithTree,
  applyTrialModuleScope,
  buildLearningLessonFromMaterial,
  findNextVideoMaterialId,
  flattenMaterialsInOrder,
  formatMaterialDuration,
  mapApiModulesToCourseStructure,
  parseDurationLabelToSeconds,
  parseQuizMaterialContent,
} from './coursePageMappers';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { pushUiModal } = useModal();

  const [course, setCourse] = useState<ApiCourseWithTree | null>(null);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizPlaceholderResult, setQuizPlaceholderResult] = useState<QuizResultSummary | null>(
    null,
  );
  const [completedMaterialIds, setCompletedMaterialIds] = useState<Set<string>>(() => new Set());
  const [videoCompletionSaving, setVideoCompletionSaving] = useState(false);
  const [videoCompletionError, setVideoCompletionError] = useState<string | null>(null);
  const [courseOutline, setCourseOutline] = useState<CourseModule[]>([]);
  const [lockedModuleIds, setLockedModuleIds] = useState<ReadonlySet<string>>(() => new Set());
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
      setCourseOutline([]);
      setLockedModuleIds(new Set());
      try {
        const { data } = await apiInstance.get<ApiCourseWithTree>(
          API_ENDPOINTS.courses.byId(courseId),
        );
        if (cancelled) return;
        const courseForUi = applyTrialModuleScope(data);
        setCourse(courseForUi);

        const raw = data as ApiCourseWithTree;
        const trialMulti =
          raw.my_access?.access_type === 'trial' && (raw.modules?.length ?? 0) > 1;
        if (trialMulti) {
          setCourseOutline(mapApiModulesToCourseStructure(raw.modules ?? []));
          const sorted = [...(raw.modules ?? [])].sort(
            (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
          );
          setLockedModuleIds(new Set(sorted.slice(1).map((m) => m.id)));
        } else {
          setCourseOutline(mapApiModulesToCourseStructure(courseForUi.modules ?? []));
          setLockedModuleIds(new Set());
        }

        const flat = flattenMaterialsInOrder(courseForUi);
        const firstId = flat[0]?.material.id ?? null;
        const firstMat = flat[0]?.material;
        setQuizPlaceholderResult(null);
        setSelectedMaterialId(firstId);
        setQuizModalOpen(Boolean(firstMat && String(firstMat.type).toLowerCase() === 'quiz'));
        setLoadStatus('idle');
      } catch (err: unknown) {
        if (cancelled) return;
        const status =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
        if (status === 403) {
          setLoadError(
            'You do not have access to this course. Purchase the course or start a trial from the catalog, then open it from My learning.',
          );
          setLoadStatus('error');
          setCourse(null);
          return;
        }
        const message =
          err && typeof err === 'object' && 'response' in err
            ? String(
                (err as { response?: { data?: { message?: unknown } } }).response?.data?.message ??
                  '',
              )
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

  useEffect(() => {
    if (!courseId || !course || currentUser?.role !== 'student') {
      setCompletedMaterialIds(new Set());
      return;
    }
    let cancelled = false;
    void fetchCourseProgress(courseId)
      .then((res) => {
        if (cancelled) return;
        setCompletedMaterialIds(
          new Set(res.completed_materials.map((row) => row.course_material_id)),
        );
      })
      .catch(() => {
        if (!cancelled) setCompletedMaterialIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, course, currentUser?.role]);

  const structureModules = useMemo(() => {
    if (courseOutline.length > 0) return courseOutline;
    return mapApiModulesToCourseStructure(course?.modules);
  }, [courseOutline, course?.modules]);

  const flatMaterials = useMemo(() => (course ? flattenMaterialsInOrder(course) : []), [course]);

  const selectedMaterial = useMemo(
    () => flatMaterials.find((r) => r.material.id === selectedMaterialId)?.material,
    [flatMaterials, selectedMaterialId],
  );

  const selectedModuleId = useMemo(
    () => flatMaterials.find((r) => r.material.id === selectedMaterialId)?.moduleId ?? null,
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
    const base = buildLearningLessonFromMaterial(
      course.title,
      ref.material,
      idx >= 0 ? idx : 0,
      flatMaterials.length,
    );
    const total = flatMaterials.length;
    const completedCount = flatMaterials.filter((r) =>
      completedMaterialIds.has(r.material.id),
    ).length;
    return {
      ...base,
      progress: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      progressText:
        total > 0 ? `${completedCount} of ${total} lessons completed` : '0 of 0 lessons completed',
    };
  }, [course, flatMaterials, selectedMaterialId, completedMaterialIds]);

  const isStudentVideoProgress =
    currentUser?.role === 'student' &&
    Boolean(
      selectedMaterialId &&
      selectedMaterial &&
      String(selectedMaterial.type).toLowerCase() === 'video',
    );

  const videoFallbackSeconds = useMemo(() => {
    if (!selectedMaterial || String(selectedMaterial.type).toLowerCase() !== 'video') return null;
    return parseDurationLabelToSeconds(formatMaterialDuration(selectedMaterial)) ?? 480;
  }, [selectedMaterial]);

  const handleMarkVideoComplete = useCallback(async () => {
    if (!courseId || !selectedMaterialId || !selectedModuleId || currentUser?.role !== 'student') {
      return;
    }
    setVideoCompletionError(null);
    setVideoCompletionSaving(true);
    try {
      await completeCourseMaterial(courseId, selectedModuleId, selectedMaterialId);
      setCompletedMaterialIds((prev) => new Set(prev).add(selectedMaterialId));
    } catch (err: unknown) {
      setVideoCompletionError(getErrorMessage(err, 'Could not update lesson progress.'));
    } finally {
      setVideoCompletionSaving(false);
    }
  }, [courseId, selectedMaterialId, selectedModuleId, currentUser?.role]);

  const handleSelectLesson = useCallback(
    (payload: { moduleId: string; materialId: string }) => {
      if (lockedModuleIds.has(payload.moduleId)) return;
      setQuizPlaceholderResult(null);
      setSelectedMaterialId(payload.materialId);
      const mat = flatMaterials.find((r) => r.material.id === payload.materialId)?.material;
      const isQuiz = Boolean(mat && String(mat.type).toLowerCase() === 'quiz');
      setQuizModalOpen(isQuiz);
    },
    [flatMaterials, lockedModuleIds],
  );

  const handleNextVideoLesson = useCallback(() => {
    if (!nextVideoMaterialId) return;
    setQuizPlaceholderResult(null);
    const mat = flatMaterials.find((r) => r.material.id === nextVideoMaterialId)?.material;
    const isQuiz = Boolean(mat && String(mat.type).toLowerCase() === 'quiz');
    setQuizModalOpen(isQuiz);
    setSelectedMaterialId(nextVideoMaterialId);
  }, [nextVideoMaterialId, flatMaterials]);

  const isFirstScrollRef = useRef(true);
  useEffect(() => {
    if (isFirstScrollRef.current) {
      mainScrollRef.current?.scrollTo({ top: 0 });
      isFirstScrollRef.current = false;
    } else {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedMaterialId]);

  useEffect(() => {
    setVideoCompletionError(null);
  }, [selectedMaterialId]);

  const handleAddWord = useCallback(() => {
    pushUiModal({ type: 'addVocabulary' });
  }, [pushUiModal]);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-neutral-white)] px-4">
        <p className="max-w-md text-center text-[var(--color-error)]">{loadError ?? 'Course not found.'}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <NavLink
            to={ROUTES.COURSES}
            className="rounded-full border border-[var(--opacity-neutral-darkest-15)] px-4 py-2 text-[1.125rem] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]"
          >
            All courses
          </NavLink>
          <NavLink
            to={ROUTES.MY_LEARNING}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-[1.125rem] text-[var(--color-text-on-accent)] hover:bg-[var(--color-primary-hover)]"
          >
            My learning
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] overflow-hidden bg-[var(--color-surface-section)]">
      <CourseLearningSidebar
        modules={structureModules}
        onSelectLesson={handleSelectLesson}
        selectedMaterialId={selectedMaterialId}
        completedMaterialIds={completedMaterialIds}
        lockedModuleIds={lockedModuleIds}
        checkoutCourseId={lockedModuleIds.size > 0 ? courseId : undefined}
      />

      <div ref={mainScrollRef} className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex gap-4 w-full justify-center border-b border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-dawn-pink-lighter)] px-4 py-4 lg:justify-start lg:px-10">
          <NavLink
            to={ROUTES.VOCABULARY.replace(':courseId', courseId)}
            className="text-[1.125rem] text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
          >
            Vocabulary
          </NavLink>
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
              key={selectedMaterialId ?? currentLesson.materialId ?? currentLesson.videoUrl}
              lesson={currentLesson}
              hasNextVideoLesson={Boolean(nextVideoMaterialId)}
              onNextVideoLesson={handleNextVideoLesson}
              isVideoLessonCompleted={
                isStudentVideoProgress && selectedMaterialId
                  ? completedMaterialIds.has(selectedMaterialId)
                  : false
              }
              onMarkVideoComplete={
                isStudentVideoProgress && selectedModuleId ? handleMarkVideoComplete : undefined
              }
              isVideoCompletionSaving={videoCompletionSaving}
              videoCompletionError={videoCompletionError}
              fallbackMarkReadyAfterSeconds={videoFallbackSeconds}
              onAddWord={handleAddWord}
            />
          ) : null}
          {flatMaterials.length > 0 && isQuizSelected ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <p className="max-w-md text-lg font-medium text-[var(--color-text-primary)]">
                {selectedMaterial?.title ?? 'Quiz'}
              </p>
              {quizPlaceholderResult ? (
                <div
                  className="max-w-md rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-6 py-5 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Your last result
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--color-primary)] tabular-nums">
                    {quizPlaceholderResult.percent}%
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {quizPlaceholderResult.correct} of {quizPlaceholderResult.total} questions
                    correct
                  </p>
                </div>
              ) : (
                <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
                  Open the quiz to answer the questions for this lesson.
                </p>
              )}
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
          courseMaterialId={selectedMaterial.id}
          greetingName={greetingName}
          quizMaterialTitle={selectedMaterial.title || 'Quiz'}
          questions={parsedQuizQuestions}
          onQuizResult={setQuizPlaceholderResult}
        />
      ) : null}
    </div>
  );
};

export default CoursePage;
