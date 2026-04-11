import type { QuizQuestionFormItem } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type { CourseMaterialType } from '@/types/features/courseManagment/CourseMaterialCreateTab.types';

export type CourseMaterialInitialState = {
  materialType: CourseMaterialType;
  title: string;
  youtubeVideoId: string;
  youtubeVideoDuration: string;
  quizQuestions: QuizQuestionFormItem[];
  createdMaterialId: string | null;
  savedSnapshot: string | null;
};
