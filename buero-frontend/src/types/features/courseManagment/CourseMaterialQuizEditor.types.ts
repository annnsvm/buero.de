import type { Dispatch, SetStateAction } from 'react';
import type { QuizQuestionFormItem } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export type CourseMaterialQuizEditorProps = {
  quizQuestions: QuizQuestionFormItem[];
  isSubmitting: boolean;
  onQuizQuestionsChange: Dispatch<SetStateAction<QuizQuestionFormItem[]>>;
  onRemoveQuestion: (questionId: string) => void;
  onRemoveAnswer: (questionId: string, answerId: string) => void;
};
