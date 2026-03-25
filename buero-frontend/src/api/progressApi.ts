import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type CourseProgressMaterialRow = {
  course_material_id: string;
  module_id?: string;
  completed_at: string;
  score: number | null;
};

export type CourseProgressResponse = {
  completed_materials: CourseProgressMaterialRow[];
};

export const fetchCourseProgress = async (courseId: string): Promise<CourseProgressResponse> => {
  const { data } = await apiInstance.get<CourseProgressResponse>(API_ENDPOINTS.progress.course(courseId));
  return data;
};

export const completeCourseMaterial = async (
  courseId: string,
  moduleId: string,
  materialId: string,
): Promise<unknown> => {
  const { data } = await apiInstance.post(API_ENDPOINTS.progress.complete(courseId, moduleId, materialId), {});
  return data;
};
