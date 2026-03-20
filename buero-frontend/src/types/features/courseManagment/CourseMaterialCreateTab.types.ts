import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type { CreateCourseMaterialModalValues } from '@/types/features/courseManagment/CreateCourseMaterialModal.types';

export type CourseMaterialType = 'video' | 'quiz';

export type CourseMaterialCreateTabProps = {
  modules: Modules[];
  activeModuleId: string | null;
  activeMaterialId: string | null;
  isSubmitting: boolean;
  onCreate: (values: CreateCourseMaterialModalValues) => Promise<{ id: string }>;
  onUpdate: (materialId: string, values: CreateCourseMaterialModalValues) => Promise<void>;
};
