import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

import { courseFormFields } from './courseFormFields';

export const courseUpdatePayload = (
  values: CreateCourseFormValues,
): Record<string, unknown> => courseFormFields(values);
