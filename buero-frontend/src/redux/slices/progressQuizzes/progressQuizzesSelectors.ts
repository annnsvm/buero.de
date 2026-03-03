import type { RootState } from "../../store";

export const selectOverallProgress = (state: RootState) =>
  state.progressQuizzes.overallProgress;
export const selectCourseProgressById = (state: RootState) =>
  state.progressQuizzes.courseProgressById;
export const selectProgressQuizzesStatus = (state: RootState) =>
  state.progressQuizzes.status;
