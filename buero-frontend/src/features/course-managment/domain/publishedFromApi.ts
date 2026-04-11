import type { ApiCourseTreeResponse } from '@/types/features/courseManagment';

export const publishedFromApi = (data: ApiCourseTreeResponse): boolean =>
  data.isPublished === true || data.is_published === true;
