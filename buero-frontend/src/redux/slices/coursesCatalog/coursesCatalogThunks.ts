import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { mapApiCourseToCourseCard } from '@/api/myLearningCourses';
import type { CatalogCourse } from '@/types/api/myLearningCourses.types';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import type { CoursesCatalogFilters } from './coursesCatalogSlice';

type FetchCoursesResponse = {
  items: CourseCardProps[];
  totalCount: number;
};

const buildQueryString = (
  filters: CoursesCatalogFilters,
  isTeacherManage: boolean,
) => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.tags?.trim()) params.set('tags', filters.tags.trim());
  if (
    isTeacherManage &&
    filters.publicationStatus &&
    filters.publicationStatus !== 'all'
  ) {
    params.set('publication_status', filters.publicationStatus);
  }

  return params.toString();
};

export const fetchCoursesCatalogThunk = createAsyncThunk<
  FetchCoursesResponse,
  void,
   { state: any; rejectValue: string } 
>('coursesCatalog/fetch', async (_, { getState, rejectWithValue }) => {
  const state = getState() as any;
  const { filters } = state.coursesCatalog;
  const currentUserRole = state.user?.currentUser?.role as 'student' | 'teacher' | undefined;
  const isTeacherManage = currentUserRole === 'teacher';
  const endpoint = isTeacherManage ? API_ENDPOINTS.courses.manage : API_ENDPOINTS.courses.list;

  const query = buildQueryString(filters, isTeacherManage);

  try {
    const res = await apiInstance.get<unknown[]>(
      query ? `${endpoint}?${query}` : endpoint,
    );

    const raw = Array.isArray(res.data) ? res.data : [];
    const items = raw.map((row) => mapApiCourseToCourseCard(row as CatalogCourse));

    return {
      items,
      totalCount: items.length,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Network error while loading courses';

    return rejectWithValue(message);
  }
});