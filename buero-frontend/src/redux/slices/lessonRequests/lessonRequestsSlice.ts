import { createSlice } from "@reduxjs/toolkit";

export type LessonRequestsState = {
  studentRequests: unknown[];
  teacherRequests: unknown[];
  status: "idle" | "loading" | "submitting" | "error";
  error: string | null;
};

const initialState: LessonRequestsState = {
  studentRequests: [],
  teacherRequests: [],
  status: "idle",
  error: null,
};

const lessonRequestsSlice = createSlice({
  name: "lessonRequests",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export const lessonRequestsReducer = lessonRequestsSlice.reducer;
