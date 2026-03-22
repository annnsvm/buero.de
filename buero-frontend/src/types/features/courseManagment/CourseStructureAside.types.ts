import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type CourseStructureAsideProps = {
  modules: Modules[];
  courseId: string | null;
  courseTitle: string | null;
  onSelectCourse: () => void;
  onCreateModule: () => void;
  onEditModule: (moduleId: string, moduleTitle: string) => void;
  onCreateMaterial: (moduleId: string) => void;
  onSelectMaterial: (moduleId: string, materialId: string) => void;
  onRequestDeleteCourse?: () => void;
  onRequestDeleteModule?: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteMaterial?: (moduleId: string, materialId: string) => void;
  /** Показувати «Publish course», якщо є матеріали і курс ще не опублікований */
  showPublishCourseButton?: boolean;
  onRequestPublishCourse?: () => void;
};

export type CourseAsideActionButtonProps = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  onAfterClick?: () => void;
  className?: string;
};

export type CourseStructureAsideCourseHeaderProps = {
  courseTitle: string | null;
  onSelectCourse: () => void;
  onAfterClick?: () => void;
  onRequestDeleteCourse?: () => void;
};

export type CourseStructureAsideEmptyStateProps = {
  hasCourse: boolean;
};

