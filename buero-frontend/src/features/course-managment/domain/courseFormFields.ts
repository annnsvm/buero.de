import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

export const courseFormFields = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  title: values.title.trim(),
  description: values.description?.trim() ?? '',
  language: values.language,
  tags: values.tags,
  price: Number(values.price.trim()),
  level: values.level,
  ...(values.durationHours?.trim()
    ? { duration_hours: Number(values.durationHours.trim()) }
    : {}),
});
