import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export const materialContentPayload = (
  payload: CreateCourseMaterialModalValues,
): Record<string, unknown> => {
  if (payload.type === 'video') {
    return {
      youtube_video_id: payload.youtubeVideoId,
      duration: payload.youtubeVideoDuration,
    };
  }

  return {
    questions: payload.quizQuestions.map((questionItem, qIdx) => {
      const normalizedQuestionId = questionItem.id || `q${qIdx + 1}`;
      const options = questionItem.answers.map((answerItem, aIdx) => ({
        id: answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
        text: answerItem.text,
      }));
      const correctIds = questionItem.answers
        .filter((answerItem) => answerItem.isCorrect)
        .map(
          (answerItem, aIdx) => answerItem.id || `${normalizedQuestionId}_opt_${aIdx + 1}`,
        );
      return {
        id: normalizedQuestionId,
        text: questionItem.question,
        options,
        correct: correctIds.length > 1 ? correctIds : (correctIds[0] ?? ''),
      };
    }),
  };
};
