import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: fetchOverallProgress, fetchCourseProgress, startQuizAttempt, submitQuizAnswer, completeQuiz

export const fetchOverallProgressThunk = createAsyncThunk(
  "progressQuizzes/fetchOverall",
  async () => null
);
