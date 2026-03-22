export type LearningLesson = {
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
    /** Є наступне відео в цьому ж або наступному модулі (за порядком курсу). */
    hasNextVideoLesson?: boolean;
    onNextVideoLesson?: () => void;
  };