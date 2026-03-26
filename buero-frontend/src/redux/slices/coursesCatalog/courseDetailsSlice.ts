import { createSlice } from '@reduxjs/toolkit';
import { fetchCourseByIdThunk, type CourseDetailsResponse } from './courseDetailsThunks';

export type CourseDetailsState = {
  data: CourseDetailsResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: CourseDetailsState = {
  data: null,
  status: 'idle',
  error: null,
};

const courseDetailsSlice = createSlice({
  name: 'courseDetails',
  initialState,
  reducers: {
    clearCourseDetails: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseByIdThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourseByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCourseByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load course details';
      });
  },
});

export const courseDetailsReducer = courseDetailsSlice.reducer;
export const { clearCourseDetails } = courseDetailsSlice.actions;