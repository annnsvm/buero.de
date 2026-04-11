import type { ApiCourseTreeResponse } from '@/types/features/courseManagment';

export const coverUrlFromApi = (data: ApiCourseTreeResponse): string | null => {
  const u = data.image_url ?? data.imageUrl;
  return typeof u === 'string' && u.trim() ? u : null;
};
