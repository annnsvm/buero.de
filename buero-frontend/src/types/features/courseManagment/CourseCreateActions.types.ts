import type { CourseEditorMode } from '@/types/features/courseManagment/CourseEditorMode.types';

export type CourseCreateActionsProps = {
  mode: CourseEditorMode;
  canCreate: boolean;
  isCreating: boolean;
  canUpdate: boolean;
  isUpdating: boolean;
  error: string | null;
  onCreateCourse: () => void;
  onUpdateCourse: () => void;
};
