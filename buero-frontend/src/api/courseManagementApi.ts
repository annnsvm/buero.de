import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

import type { ApiCourseTreeResponse } from '@/types/features/courseManagment/ApiCourseTree.types';

export const fetchCourseById = async (courseId: string) =>
  apiInstance.get<ApiCourseTreeResponse>(API_ENDPOINTS.courses.byId(courseId));

export const createCourse = async (payload: Record<string, unknown>) =>
  apiInstance.post<{ id: string }>(API_ENDPOINTS.courses.create, payload);

export const patchCourse = async (courseId: string, payload: Record<string, unknown>) =>
  apiInstance.patch(API_ENDPOINTS.courses.update(courseId), payload);

export const uploadCourseCover = async (courseId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiInstance.post<ApiCourseTreeResponse>(API_ENDPOINTS.courses.cover(courseId), formData, {
    transformRequest: [
      (data, headers) => {
        if (headers && typeof (headers as { delete?: (k: string) => void }).delete === 'function') {
          (headers as { delete: (k: string) => void }).delete('Content-Type');
        }
        return data;
      },
    ],
  });
};

export const deleteCourse = async (courseId: string) =>
  apiInstance.delete(API_ENDPOINTS.courses.delete(courseId));

export const createModule = async (
  courseId: string,
  body: { title: string; order_index: number },
) => apiInstance.post(API_ENDPOINTS.courseModules.create(courseId), body);

export const updateModule = async (
  courseId: string,
  moduleId: string,
  body: { title: string },
) => apiInstance.patch(API_ENDPOINTS.courseModules.update(courseId, moduleId), body);

export const deleteModule = async (courseId: string, moduleId: string) =>
  apiInstance.delete(API_ENDPOINTS.courseModules.delete(courseId, moduleId));

export const createMaterial = async (
  courseId: string,
  moduleId: string,
  body: {
    type: string;
    title: string;
    content: Record<string, unknown>;
    order_index: number;
  },
) => apiInstance.post<{ id: string }>(API_ENDPOINTS.courseMaterials.create(courseId, moduleId), body);

export const updateMaterial = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  body: { type: string; title: string; content: Record<string, unknown> },
) =>
  apiInstance.patch(
    API_ENDPOINTS.courseMaterials.update(courseId, moduleId, materialId),
    body,
  );

export const deleteMaterial = async (
  courseId: string,
  moduleId: string,
  materialId: string,
) =>
  apiInstance.delete(API_ENDPOINTS.courseMaterials.delete(courseId, moduleId, materialId));
