import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import type { CoursesCatalogFilters } from './coursesCatalogSlice';

type FetchCoursesResponse = {
  items: CourseCardProps[];
  totalCount: number;
};

const buildQueryString = (filters: CoursesCatalogFilters, page: number, pageSize: number) => {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.level) params.set('level', filters.level);
  if (filters.search?.trim()) params.set('search', filters.search.trim());

  return params.toString();
};

export const fetchCoursesCatalogThunk = createAsyncThunk<
  FetchCoursesResponse,
  void,
   { state: any; rejectValue: string } 
>('coursesCatalog/fetch', async (_, { getState, rejectWithValue }) => {
  const { filters, page, pageSize } = (getState() as any).coursesCatalog;

  const query = buildQueryString(filters, page, pageSize);

  try {
    const res = await apiInstance.get<FetchCoursesResponse>(
      `http://localhost:3000/api/courses?${query}`,
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