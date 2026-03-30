export type LearningLesson = {
  materialId?: string;
  courseTitle: string;
  progressText: string;
  streak: string;
  progress: number;
  type: string;
  status: string;
  title: string;
  description: string;
  videoUrl: string;
};

export type LearningPageProps = {
  lesson?: LearningLesson;
  hasNextVideoLesson?: boolean;
  onNextVideoLesson?: () => void;
  isVideoLessonCompleted?: boolean;
  onMarkVideoComplete?: () => void | Promise<void>;
  isVideoCompletionSaving?: boolean;
  videoCompletionError?: string | null;
  fallbackMarkReadyAfterSeconds?: number | null;
  onAddWord?: () => void;
};
