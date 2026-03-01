import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: createLessonRequest, fetchStudentRequests, fetchTeacherRequests, accept, reject, complete when API is ready

export const fetchLessonRequestsThunk = createAsyncThunk(
  "lessonRequests/fetch",
  async () => ({ student: [], teacher: [] })
);
