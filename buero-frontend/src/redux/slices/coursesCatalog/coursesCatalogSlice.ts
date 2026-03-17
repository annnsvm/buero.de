import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { fetchCoursesCatalogThunk } from './coursesCatalogThunks';

export type CoursesCatalogFilters = {
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category?: 'language' | 'integration' | 'sociocultural';
  search?: string;
};

export type CoursesCatalogState = {
  items: CourseCardProps[];
  totalCount: number;
  filters: CoursesCatalogFilters;
  page: number;
  pageSize: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: CoursesCatalogState = {
  items: [],
  totalCount: 0,
  filters: {},
  page: 1,
  pageSize: 12,
  status: 'idle',
  error: null,
};

const coursesCatalogSlice = createSlice({
  name: 'coursesCatalog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CoursesCatalogFilters>) => {
      state.filters = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {};
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesCatalogThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCoursesCatalogThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCoursesCatalogThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load courses';
      });
  },
});

export const coursesCatalogReducer = coursesCatalogSlice.reducer;
export const { setFilters, setPage, resetFilters } = coursesCatalogSlice.actions;
