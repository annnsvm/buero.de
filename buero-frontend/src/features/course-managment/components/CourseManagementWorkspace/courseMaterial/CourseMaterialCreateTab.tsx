import React, { useMemo, useState } from 'react';
import { Button, FormField, Input, Select, Spinner } from '@/components/ui';
import type {
  CreateCourseMaterialModalValues,
  QuizQuestionFormItem,
} from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type {
  CourseMaterialCreateTabProps,
  CourseMaterialType,
} from '@/types/features/courseManagment/CourseMaterialCreateTab.types';
import { extractYouTubeVideoId } from '@/features/course-managment/helpers/extractYouTubeVideoId';
import { MATERIAL_TYPE_OPTIONS } from '@/features/course-managment/helpers/courseMaterials.consts';
import CourseMaterialCreateSection from './CourseMaterialCreateSection';
import CourseMaterialQuizEditor from './CourseMaterialQuizEditor';
import CourseMaterialVideoFields from './CourseMaterialVideoFields';
import { getInitialMaterialState } from './helpers/courseMaterialInitialState';

const CourseMaterialCreateTab: React.FC<CourseMaterialCreateTabProps> = ({
  modules,
  activeModuleId,
  activeMaterialId,
  isSubmitting,
  onCreate,
  onUpdate,
  onRequestDeleteMaterial,
}) => {
  const activeModule = useMemo(
    () => modules.find((m) => m.id === activeModuleId) ?? null,
    [modules, activeModuleId],
  );
  const selectedMaterial = useMemo(
    () => activeModule?.materials.find((m) => m.id === activeMaterialId) ?? null,
    [activeModule, activeMaterialId],
  );
  const initialState = getInitialMaterialState(selectedMaterial);

  const [materialType, setMaterialType] = useState<CourseMaterialType>(initialState.materialType);
  const [title, setTitle] = useState(initialState.title);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialState.youtubeVideoId);
  const [youtubeVideoDuration, setYoutubeVideoDuration] = useState(
    initialState.youtubeVideoDuration,
  );
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionFormItem[]>(
    initialState.quizQuestions,
  );
  const [error, setError] = useState<string | null>(null);
  const [createdMaterialId, setCreatedMaterialId] = useState<string | null>(
    initialState.createdMaterialId,
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(initialState.savedSnapshot);

  const buildPayload = (): CreateCourseMaterialModalValues =>
    materialType === 'video'
      ? {
          type: 'video',
          title: title.trim(),
          youtubeVideoId: extractYouTubeVideoId(youtubeVideoId) ?? youtubeVideoId.trim(),
          youtubeVideoDuration: youtubeVideoDuration.trim(),
        }
      : {
          type: 'quiz',
          title: title.trim(),
          quizQuestions: quizQuestions.map((questionItem) => ({
            ...questionItem,
            question: questionItem.question.trim(),
            answers: questionItem.answers.map((answer) => ({
              ...answer,
              text: answer.text.trim(),
            })),
          })),
        };

  const currentSnapshot = JSON.stringify(buildPayload());
  const isCreatedState = Boolean(createdMaterialId) && savedSnapshot === currentSnapshot;
  const isUpdateState = Boolean(createdMaterialId) && savedSnapshot !== currentSnapshot;

  const handleCreateOrUpdate = async () => {
    if (!activeModuleId) {
      setError('Please select module first');
      return;
    }
    if (!title.trim()) return setError('Material title is required');
    if (materialType === 'video' && !youtubeVideoId.trim())
      return setError('YouTube video id is required');
    if (materialType === 'video' && !extractYouTubeVideoId(youtubeVideoId)) {
      return setError('Enter a valid YouTube video id or a supported YouTube link (watch, youtu.be, embed)');
    }
    if (materialType === 'video' && !youtubeVideoDuration.trim())
      return setError('Video duration is required');
    if (materialType === 'quiz') {
      if (quizQuestions.length === 0) return setError('Add at least one quiz question');
      for (const questionItem of quizQuestions) {
        if (!questionItem.question.trim()) return setError('Each quiz question must have text');
        const filledAnswers = questionItem.answers.filter((answerItem) => answerItem.text.trim());
        if (filledAnswers.length < 2)
          return setError('Each quiz question must have at least 2 answers');
        const hasCorrect = filledAnswers.some((answerItem) => answerItem.isCorrect);
        if (!hasCorrect) return setError('Mark at least one correct answer for each quiz question');
      }
    }

    setError(null);
    const payload = buildPayload();

    if (createdMaterialId) {
      if (savedSnapshot === currentSnapshot) return;
      await onUpdate(createdMaterialId, payload);
      setSavedSnapshot(JSON.stringify(payload));
      return;
    }
    const created = await onCreate(payload);
    setCreatedMaterialId(created.id);
    setSavedSnapshot(JSON.stringify(payload));
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (quizQuestions.length <= 1) {
      setError('At least one question is required');
      return;
    }
    setError(null);
    setQuizQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleRemoveAnswer = (questionId: string, answerId: string) => {
    const target = quizQuestions.find((q) => q.id === questionId);
    if (!target || target.answers.length <= 2) {
      setError('Each question must have at least 2 answers');
      return;
    }
    setError(null);
    setQuizQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) } : q,
      ),
    );
  };

  return (
    <CourseMaterialCreateSection>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Create material</p>

      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {activeModule ? `Module: ${activeModule.title}` : 'Select a module from sidebar'}
      </p>

      <div className="mt-4 space-y-4">
        <FormField label="Material type" name="materialTypeTab">
          <Select
            ariaLabel="Material type"
            value={materialType}
            options={MATERIAL_TYPE_OPTIONS}
            onChange={(nextValue) => setMaterialType(nextValue as CourseMaterialType)}
            disabled={Boolean(createdMaterialId) || isSubmitting}
          />
        </FormField>

        <FormField label="Material title" name="materialTitleTab">
          <Input
            id="materialTitleTab"
            placeholder="e.g. Lesson 1: Greetings"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </FormField>

        {materialType === 'video' ? (
          <CourseMaterialVideoFields
            youtubeVideoId={youtubeVideoId}
            youtubeVideoDuration={youtubeVideoDuration}
            isSubmitting={isSubmitting}
            onYoutubeVideoIdChange={setYoutubeVideoId}
            onYoutubeVideoDurationChange={setYoutubeVideoDuration}
          />
        ) : (
          <CourseMaterialQuizEditor
            quizQuestions={quizQuestions}
            isSubmitting={isSubmitting}
            onQuizQuestionsChange={setQuizQuestions}
            onRemoveQuestion={handleRemoveQuestion}
            onRemoveAnswer={handleRemoveAnswer}
          />
        )}
      </div>

      {error ? <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p> : null}

      {activeMaterialId && onRequestDeleteMaterial ? (
        <div className="mt-6 flex justify-center border-t border-[var(--color-border-subtle)] pt-6">
          <Button
            type="button"
            variant="outlineDark"
            onClick={onRequestDeleteMaterial}
            disabled={isSubmitting}
            className="!border-[var(--color-error)] !text-[var(--color-error)] hover:!border-[var(--color-error)]"
          >
            Delete material
          </Button>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-center">
        <Button
          type="button"
          variant="solid"
          onClick={handleCreateOrUpdate}
          disabled={isSubmitting || isCreatedState}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner variant="onPrimary" className="size-5" />
              {isUpdateState ? 'Updating' : 'Creating'}
            </span>
          ) : isCreatedState ? (
            'Created'
          ) : isUpdateState ? (
            'Update'
          ) : (
            'Create material'
          )}
        </Button>
      </div>
    </CourseMaterialCreateSection>
  );
};

export default CourseMaterialCreateTab;
