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
  lastFetchKey: string | null;
  lastFetchAt: number | null;
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
  lastFetchKey: null,
  lastFetchAt: null,
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
      state.lastFetchKey = null;
      state.lastFetchAt = null;
    },
    setCatalogItemOrder: (state, action: PayloadAction<CourseCardProps[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesCatalogThunk.pending, (state) => {
        if (state.items.length === 0) {
          state.status = 'loading';
        }
        state.error = null;
      })
      .addCase(fetchCoursesCatalogThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.activeTrialCourseId = action.payload.activeTrialCourseId ?? null;
        state.lastFetchKey = action.payload.fetchKey;
        state.lastFetchAt = Date.now();
      })
      .addCase(fetchCoursesCatalogThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load courses';
      });
  },
});

export const coursesCatalogReducer = coursesCatalogSlice.reducer;
export const { setFilters, setPage, resetFilters, resetCoursesCatalog, setCatalogItemOrder } =
  coursesCatalogSlice.actions;
