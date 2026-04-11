import type { Dispatch, SetStateAction } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type UseCourseEditorTreeParams = {
  setValue: UseFormSetValue<CreateCourseFormValues>;
  setModules: Dispatch<SetStateAction<Modules[]>>;
  setIsCoursePublished: Dispatch<SetStateAction<boolean>>;
};
