import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type QuizAttemptResponse = {
  id: string;
  course_material_id: string;
  status: 'in_progress' | 'completed';
  answers_snapshot: Record<string, unknown> | null;
  score: number | null;
  completed_at: string | null;
  created_at: string;
};

export const startQuizAttempt = async (courseMaterialId: string): Promise<QuizAttemptResponse> => {
  const { data } = await apiInstance.post<QuizAttemptResponse>(API_ENDPOINTS.quiz.startAttempt, {
    course_material_id: courseMaterialId,
  });
  return data;
};

export type SubmitQuizAnswerItem = { question_id: string; answer: string | string[] };

export type SubmitQuizResponse = {
  score: number;
  total: number;
  correct: number;
  results: Array<{ question_id: string; correct: boolean }>;
  attempt: QuizAttemptResponse;
};

export const submitQuizAttempt = async (
  attemptId: string,
  body: { answers: SubmitQuizAnswerItem[] },
): Promise<SubmitQuizResponse> => {
  const { data } = await apiInstance.post<SubmitQuizResponse>(
    API_ENDPOINTS.quiz.submit(attemptId),
    body,
  );
  return data;
};
