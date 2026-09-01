import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { fetchCourseProgress, type CourseProgressResponse } from '@/api/progressApi';
import type { ApiCourseWithTree } from '@/pages/CoursePage/coursePageMappers';

const TTL_MS = 20_000;

type CacheEntry<T> = { data: T; at: number };

const courseCache = new Map<string, CacheEntry<ApiCourseWithTree>>();
const progressCache = new Map<string, CacheEntry<CourseProgressResponse | null>>();

const readFresh = <T>(map: Map<string, CacheEntry<T>>, key: string): T | undefined => {
  const hit = map.get(key);
  if (!hit || Date.now() - hit.at > TTL_MS) return undefined;
  return hit.data;
};

export const getCachedCourseTree = async (courseId: string): Promise<ApiCourseWithTree> => {
  const cached = readFresh(courseCache, courseId);
  if (cached) return cached;
  const { data } = await apiInstance.get<ApiCourseWithTree>(API_ENDPOINTS.courses.byId(courseId));
  courseCache.set(courseId, { data, at: Date.now() });
  return data;
};

export const getCachedCourseProgress = async (
  courseId: string,
): Promise<CourseProgressResponse | null> => {
  const cached = readFresh(progressCache, courseId);
  if (cached !== undefined) return cached;
  try {
    const data = await fetchCourseProgress(courseId);
    progressCache.set(courseId, { data, at: Date.now() });
    return data;
  } catch {
    progressCache.set(courseId, { data: null, at: Date.now() });
    return null;
  }
};

export const prefetchCourseWorkspace = (courseId: string): void => {
  void getCachedCourseTree(courseId);
  void getCachedCourseProgress(courseId);
};
