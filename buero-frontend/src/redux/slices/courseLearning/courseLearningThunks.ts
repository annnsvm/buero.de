import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCourseLearningThunk = createAsyncThunk(
  'courseLearning/fetch',
  async (_courseId: string) => ({ course: null, materials: [], progress: [] }),
);
