import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: fetchCourseLearningData(courseId), completeMaterial when API is ready

export const fetchCourseLearningThunk = createAsyncThunk(
  "courseLearning/fetch",
  async (_courseId: string) => ({ course: null, materials: [], progress: [] })
);
