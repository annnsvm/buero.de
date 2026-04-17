import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLessonRequestsThunk = createAsyncThunk('lessonRequests/fetch', async () => ({
  student: [],
  teacher: [],
}));
