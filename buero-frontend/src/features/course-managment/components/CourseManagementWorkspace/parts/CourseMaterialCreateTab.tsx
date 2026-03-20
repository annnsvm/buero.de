import React, { useMemo, useState } from 'react';
import { Button, FormField, Input, Select, Spinner } from '@/components/ui';
import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type {
  CourseMaterialCreateTabProps,
  CourseMaterialType,
} from '@/types/features/courseManagment/CourseMaterialCreateTab.types';
import { MATERIAL_TYPE_OPTIONS } from '@/features/course-managment/helpers/courseMaterials.consts';

const getInitialMaterialState = (
  selectedMaterial: CourseMaterialCreateTabProps['modules'][number]['materials'][number] | null,
) => {
  if (!selectedMaterial) {
    return {
      materialType: 'video' as CourseMaterialType,
      title: '',
      youtubeVideoId: '',
      youtubeVideoDuration: '',
      quizQuestionText: '',
      quizOptions: ['', '', '', ''] as string[],
      quizCorrectOptionIndex: 0,
      createdMaterialId: null as string | null,
      savedSnapshot: null as string | null,
    };
  }

  if (selectedMaterial.type === 'video') {
    const youtubeId =
      typeof selectedMaterial.content?.youtube_video_id === 'string'
        ? selectedMaterial.content.youtube_video_id
        : '';
    const duration =
      typeof selectedMaterial.content?.duration === 'string' ? selectedMaterial.content.duration : '';
    const payload: CreateCourseMaterialModalValues = {
      type: 'video',
      title: selectedMaterial.title ?? '',
      youtubeVideoId: youtubeId,
      youtubeVideoDuration: duration,
    };

    return {
      materialType: 'video' as CourseMaterialType,
      title: selectedMaterial.title ?? '',
      youtubeVideoId: youtubeId,
      youtubeVideoDuration: duration,
      quizQuestionText: '',
      quizOptions: ['', '', '', ''] as string[],
      quizCorrectOptionIndex: 0,
      createdMaterialId: selectedMaterial.id,
      savedSnapshot: JSON.stringify(payload),
    };
  }

  const firstQuestion = Array.isArray(selectedMaterial.content?.questions)
    ? (selectedMaterial.content?.questions?.[0] as Record<string, unknown> | undefined)
    : undefined;
  const questionText = typeof firstQuestion?.text === 'string' ? firstQuestion.text : '';
  const optionsArray = Array.isArray(firstQuestion?.options)
    ? (firstQuestion.options as Array<Record<string, unknown>>)
    : [];
  const optionTexts = [0, 1, 2, 3].map((idx) => {
    const option = optionsArray[idx];
    return typeof option?.text === 'string' ? option.text : '';
  });
  const correctId = typeof firstQuestion?.correct === 'string' ? firstQuestion.correct : 'opt_1';
  const correctIdx = Number(correctId.replace('opt_', '')) - 1;
  const safeCorrectIndex = correctIdx >= 0 ? correctIdx : 0;

  const payload: CreateCourseMaterialModalValues = {
    type: 'quiz',
    title: selectedMaterial.title ?? '',
    quizQuestionText: questionText,
    quizOptions: optionTexts,
    quizCorrectOptionIndex: safeCorrectIndex,
  };

  return {
    materialType: 'quiz' as CourseMaterialType,
    title: selectedMaterial.title ?? '',
    youtubeVideoId: '',
    youtubeVideoDuration: '',
    quizQuestionText: questionText,
    quizOptions: optionTexts,
    quizCorrectOptionIndex: safeCorrectIndex,
    createdMaterialId: selectedMaterial.id,
    savedSnapshot: JSON.stringify(payload),
  };
};

const CourseMaterialCreateTab: React.FC<CourseMaterialCreateTabProps> = ({
  modules,
  activeModuleId,
  activeMaterialId,
  isSubmitting,
  onCreate,
  onUpdate,
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
  const [youtubeVideoDuration, setYoutubeVideoDuration] = useState(initialState.youtubeVideoDuration);
  const [quizQuestionText, setQuizQuestionText] = useState(initialState.quizQuestionText);
  const [quizOptions, setQuizOptions] = useState<string[]>(initialState.quizOptions);
  const [quizCorrectOptionIndex, setQuizCorrectOptionIndex] = useState(initialState.quizCorrectOptionIndex);
  const [error, setError] = useState<string | null>(null);
  const [createdMaterialId, setCreatedMaterialId] = useState<string | null>(initialState.createdMaterialId);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(initialState.savedSnapshot);

  const buildPayload = (): CreateCourseMaterialModalValues =>
    materialType === 'video'
      ? {
          type: 'video',
          title: title.trim(),
          youtubeVideoId: youtubeVideoId.trim(),
          youtubeVideoDuration: youtubeVideoDuration.trim(),
        }
      : {
          type: 'quiz',
          title: title.trim(),
          quizQuestionText: quizQuestionText.trim(),
          quizOptions: quizOptions.map((o) => o.trim()),
          quizCorrectOptionIndex,
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
    if (materialType === 'video' && !youtubeVideoId.trim()) return setError('YouTube video id is required');
    if (materialType === 'video' && !youtubeVideoDuration.trim()) return setError('Video duration is required');
    if (materialType === 'quiz') {
      if (!quizQuestionText.trim()) return setError('Quiz question text is required');
      const trimmed = quizOptions.map((o) => o.trim());
      if (trimmed.filter(Boolean).length < 2) return setError('Please provide at least 2 quiz options');
      if (!trimmed[quizCorrectOptionIndex]) return setError('Correct option must be filled');
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

  return (
    <Section>
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
          <>
            <FormField label="YouTube video id" name="youtubeVideoIdTab">
              <Input
                id="youtubeVideoIdTab"
                placeholder="e.g. dQw4w9WgXcQ"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
            <FormField label="Video duration" name="youtubeVideoDurationTab">
              <Input
                id="youtubeVideoDurationTab"
                placeholder="e.g. 10:45"
                value={youtubeVideoDuration}
                onChange={(e) => setYoutubeVideoDuration(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </>
        ) : (
          <div className="space-y-4">
            <FormField label="Quiz question text" name="quizQuestionTextTab">
              <Input
                id="quizQuestionTextTab"
                placeholder="Type question"
                value={quizQuestionText}
                onChange={(e) => setQuizQuestionText(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Options</p>
              {quizOptions.map((opt, idx) => (
                <Input
                  key={idx}
                  id={`quizOptionTab_${idx}`}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...quizOptions];
                    next[idx] = e.target.value;
                    setQuizOptions(next);
                  }}
                  disabled={isSubmitting}
                />
              ))}
            </div>
            <FormField label="Correct option" name="quizCorrectOptionIndexTab">
              <Select
                ariaLabel="Correct option"
                value={String(quizCorrectOptionIndex)}
                options={[0, 1, 2, 3].map((i) => ({ value: String(i), label: String(i + 1) }))}
                onChange={(next) => setQuizCorrectOptionIndex(Number(next))}
              />
            </FormField>
          </div>
        )}
      </div>

      {error ? <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p> : null}

      <div className="mt-5">
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
    </Section>
  );
};

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="rounded-2xl bg-[var(--color-surface-background)] p-6">{children}</section>
);

export default CourseMaterialCreateTab;

