type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type LessonItem = {
  id: string;
  name: string;
  url: string;
  durationMinutes?: number;
  durationLabel?: string;
};

type ModuleItem = {
  id: string;
  name: string;
  lessons: LessonItem[];
  expanded: boolean;
};


export type { CreateCourseModalProps, ModuleItem, LessonItem};