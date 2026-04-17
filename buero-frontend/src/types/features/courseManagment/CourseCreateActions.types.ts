import type { CourseEditorMode } from '@/types/features/courseManagment/CourseEditorMode.types';

export type CourseCreateActionsProps = {
  mode: CourseEditorMode;
  canCreate: boolean;
  isCreating: boolean;
  canUpdate: boolean;
  isUpdating: boolean;
  lastCommitKind: 'create' | 'update' | null;
  error: string | null;
  onCreateCourse: () => void;
  onUpdateCourse: () => void;
};
