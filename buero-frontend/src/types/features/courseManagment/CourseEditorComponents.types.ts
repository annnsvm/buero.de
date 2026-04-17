import type { ReactNode } from 'react';
import type { FieldErrors, UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';

import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type { CourseManagementRightTab } from '@/types/features/courseManagment/CourseManagementPage.types';
import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type { CourseEditorMode } from '@/types/features/courseManagment/CourseEditorMode.types';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';

export type CourseEditorModalsProps = {
  createModuleModalProps: {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialTitle: string;
    handleOpenChange: (open: boolean) => void;
    onSubmitModule: (args: { title: string }) => Promise<void>;
  };
  deleteModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  publishModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  unpublishModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  createModuleModalKey: string;
};

export type CourseEditorShellProps = {
  aside: ReactNode;
  children: ReactNode;
  onRequestOpenCourseStructureMobile: () => void;
};

export type CourseEditorHeaderProps = {
  watchedTitle: string;
  watchedDescription: string;
  activeRightTab: CourseManagementRightTab;
  activeModuleTitle: string;
};

export type CourseEditorCourseFormTabProps = {
  mode: CourseEditorMode;
  handleSubmit: UseFormHandleSubmit<CreateCourseFormValues>;
  handleFormSubmit: (values: CreateCourseFormValues) => Promise<void>;
  handleCreateCourseSubmit: (values: CreateCourseFormValues) => Promise<void>;
  runCourseUpdate: () => void;
  errors: FieldErrors<CreateCourseFormValues>;
  isFormDisabled: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  isCreatingCourse: boolean;
  isUpdatingCourse: boolean;
  lastCourseCommitKind: 'create' | 'update' | null;
  createCourseError: string | null;
  coverPreviewUrl: string | null;
  setCoverFile: (f: File | null) => void;
  setCoverPreviewUrl: (url: string | null) => void;
  watchedTitle: string;
  watchedDescription: string;
  watchedLevel: string;
  watchedTags: string[];
  watchedPrice: string;
  priceCurrencySymbol: CurrencySymbol;
  setPriceCurrencySymbol: (v: CurrencySymbol) => void;
  setValue: UseFormSetValue<CreateCourseFormValues>;
  computedDurationMinutes: number;
  watchedVideoLessonsCount: number;
  coverFile: File | null;
};

export type CourseEditorMaterialPanelProps = {
  modules: Modules[];
  activeModuleIdForMaterial: string | null;
  activeMaterialIdForEdit: string | null;
  isCreatingMaterial: boolean;
  onRequestDeleteMaterial?: () => void;
  onCreate: (payload: CreateCourseMaterialModalValues) => Promise<{ id: string }>;
  onUpdate: (materialId: string, payload: CreateCourseMaterialModalValues) => Promise<void>;
};
