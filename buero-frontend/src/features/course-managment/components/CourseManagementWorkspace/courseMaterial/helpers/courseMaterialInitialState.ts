import type {
  CreateCourseMaterialModalValues,
  QuizAnswerFormItem,
  QuizQuestionFormItem,
} from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type { CourseMaterialInitialState } from '@/types/features/courseManagment/CourseMaterialInitialState.types';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

export const createLocalId = (prefix: string) =>
  `${prefix}_${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

export const createDefaultQuizQuestion = (): QuizQuestionFormItem => ({
  id: createLocalId('q'),
  question: '',
  answers: [
    { id: createLocalId('opt'), text: '', isCorrect: false },
    { id: createLocalId('opt'), text: '', isCorrect: false },
  ],
});

export const getInitialMaterialState = (
  selectedMaterial: ModuleMaterialType | null,
): CourseMaterialInitialState => {
  if (!selectedMaterial) {
    return {
      materialType: 'video',
      title: '',
      youtubeVideoId: '',
      youtubeVideoDuration: '',
      quizQuestions: [createDefaultQuizQuestion()],
      createdMaterialId: null,
      savedSnapshot: null,
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
      materialType: 'video',
      title: selectedMaterial.title ?? '',
      youtubeVideoId: youtubeId,
      youtubeVideoDuration: duration,
      quizQuestions: [createDefaultQuizQuestion()],
      createdMaterialId: selectedMaterial.id,
      savedSnapshot: JSON.stringify(payload),
    };
  }

  const quizQuestionsRaw = Array.isArray(selectedMaterial.content?.questions)
    ? (selectedMaterial.content.questions as Array<Record<string, unknown>>)
    : [];

  const parsedQuestions: QuizQuestionFormItem[] = quizQuestionsRaw.map((questionRaw, qIndex) => {
    const questionId =
      typeof questionRaw.id === 'string' && questionRaw.id.trim() ? questionRaw.id : `q${qIndex + 1}`;
    const questionText = typeof questionRaw.text === 'string' ? questionRaw.text : '';
    const correctRaw = questionRaw.correct;
    const correctIds = Array.isArray(correctRaw)
      ? correctRaw.map((v) => String(v))
      : typeof correctRaw === 'string'
        ? [correctRaw]
        : [];
    const optionsRaw = Array.isArray(questionRaw.options)
      ? (questionRaw.options as Array<Record<string, unknown>>)
      : [];
    const answers: QuizAnswerFormItem[] = optionsRaw.map((optRaw, optIndex) => {
      const optionId =
        typeof optRaw.id === 'string' && optRaw.id.trim()
          ? optRaw.id
          : `${questionId}_opt_${optIndex + 1}`;
      const optionText = typeof optRaw.text === 'string' ? optRaw.text : '';
      return {
        id: optionId,
        text: optionText,
        isCorrect: correctIds.includes(optionId),
      };
    });

    return {
      id: questionId,
      question: questionText,
      answers: answers.length >= 2 ? answers : createDefaultQuizQuestion().answers,
    };
  });
  const normalizedQuestions =
    parsedQuestions.length > 0 ? parsedQuestions : [createDefaultQuizQuestion()];

  const payload: CreateCourseMaterialModalValues = {
    type: 'quiz',
    title: selectedMaterial.title ?? '',
    quizQuestions: normalizedQuestions,
  };

  return {
    materialType: 'quiz',
    title: selectedMaterial.title ?? '',
    youtubeVideoId: '',
    youtubeVideoDuration: '',
    quizQuestions: normalizedQuestions,
    createdMaterialId: selectedMaterial.id,
    savedSnapshot: JSON.stringify(payload),
  };
};
