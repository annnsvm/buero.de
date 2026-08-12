import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type ReorderCourseItem = {
  id: string;
  order_index: number;
};

export const reorderCourses = async (items: ReorderCourseItem[]): Promise<{ updated: number }> => {
  const { data } = await apiInstance.patch<{ updated: number }>(
    API_ENDPOINTS.courses.reorder,
    { items },
  );
  return data;
};
