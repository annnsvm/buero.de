import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import type { CoursesCatalogFilters } from './coursesCatalogSlice';

type FetchCoursesResponse = {
  items: CourseCardProps[];
  totalCount: number;
};

const buildQueryString = (filters: CoursesCatalogFilters, page: number, pageSize: number) => {
  const params = new URLSearchParams();


  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.tags?.trim()) params.set('tags', filters.tags.trim());
  

  return params.toString();
};

export const fetchCoursesCatalogThunk = createAsyncThunk<
  FetchCoursesResponse,
  void,
   { state: any; rejectValue: string } 
>('coursesCatalog/fetch', async (_, { getState, rejectWithValue }) => {
  const state = getState() as any;
  const { filters, page, pageSize } = state.coursesCatalog;
  const currentUserRole = state.user?.currentUser?.role as 'student' | 'teacher' | undefined;
  const endpoint =
    currentUserRole === 'teacher'
      ? API_ENDPOINTS.courses.manage
      : API_ENDPOINTS.courses.list;

  const query = buildQueryString(filters, page, pageSize);

  try {
    const res = await apiInstance.get<FetchCoursesResponse>(
      query ? `${endpoint}?${query}` : endpoint,
    );
    
    const data = res.data;
 

    return {
      items: Array.isArray(data) ? data : [],
      totalCount: Array.isArray(data) ? data.length : 0,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Network error while loading courses';

    return rejectWithValue(message);
  }
});