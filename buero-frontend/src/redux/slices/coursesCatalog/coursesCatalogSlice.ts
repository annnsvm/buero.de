import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { fetchCoursesCatalogThunk } from './coursesCatalogThunks';

export type PublicationFilter = 'all' | 'published' | 'unpublished';

export type CoursesCatalogFilters = {
  search?: string;
  tags?: string;
  language?: string;
  publicationStatus?: PublicationFilter;
  category?: string;
};

export type CoursesCatalogState = {
  items: CourseCardProps[];
  activeTrialCourseId: string | null;
  filters: CoursesCatalogFilters;
  totalCount: number;
  page: number;
  pageSize: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: CoursesCatalogState = {
  items: [],
  activeTrialCourseId: null,
  filters: {},
  totalCount: 0,
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
    resetCoursesCatalog: (state) => {
      state.items = [];
      state.activeTrialCourseId = null;
      state.totalCount = 0;
      state.status = 'idle';
      state.error = null;
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
        state.activeTrialCourseId = action.payload.activeTrialCourseId ?? null;
      })
      .addCase(fetchCoursesCatalogThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load courses';
      });
  },
});

export const coursesCatalogReducer = coursesCatalogSlice.reducer;
export const { setFilters, setPage, resetFilters, resetCoursesCatalog } = coursesCatalogSlice.actions;
