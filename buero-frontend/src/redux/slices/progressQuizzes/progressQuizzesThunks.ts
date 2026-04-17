import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOverallProgressThunk = createAsyncThunk(
  'progressQuizzes/fetchOverall',
  async () => null,
);
