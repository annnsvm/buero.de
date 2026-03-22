import type { RootState } from '../../rootReducer';

export const selectStudentLessonRequests = (state: RootState) =>
  state.lessonRequests.studentRequests;
export const selectTeacherLessonRequests = (state: RootState) =>
  state.lessonRequests.teacherRequests;
export const selectLessonRequestsStatus = (state: RootState) => state.lessonRequests.status;
