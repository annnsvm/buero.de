import type { RootState } from '../../rootReducer';

export const selectCourseDetailsData = (state: RootState) => state.courseDetails.data;
export const selectCourseDetailsStatus = (state: RootState) => state.courseDetails.status;
export const selectCourseDetailsError = (state: RootState) => state.courseDetails.error;

export const selectCourseDetailsIsLoading = (state: RootState) => state.courseDetails.status === 'loading';