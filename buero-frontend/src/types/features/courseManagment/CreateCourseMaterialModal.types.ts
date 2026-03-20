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
      quizQuestionText: string;
      quizOptions: string[];
      quizCorrectOptionIndex: number;
    };

export type CreateCourseMaterialModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onCreateMaterial: (values: CreateCourseMaterialModalValues) => Promise<void>;
};

