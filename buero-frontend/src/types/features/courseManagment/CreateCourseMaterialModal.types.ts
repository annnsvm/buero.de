export type QuizAnswerFormItem = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestionFormItem = {
  id: string;
  question: string;
  answers: QuizAnswerFormItem[];
};

export type CreateCourseMaterialModalValues =
  | {
      type: 'video';
      title: string;
      youtubeVideoId: string;
      youtubeVideoDuration: string;
    }
  | {
      type: 'quiz';
      title: string;
      quizQuestions: QuizQuestionFormItem[];
    };

export type CreateCourseMaterialModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onCreateMaterial: (values: CreateCourseMaterialModalValues) => Promise<void>;
};

