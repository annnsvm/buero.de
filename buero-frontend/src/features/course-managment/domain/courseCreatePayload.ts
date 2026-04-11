import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

import { courseFormFields } from './courseFormFields';

export const courseCreatePayload = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  ...courseFormFields(values),
  is_published: false,
});
