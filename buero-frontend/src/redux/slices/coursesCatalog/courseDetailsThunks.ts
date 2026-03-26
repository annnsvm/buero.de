import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';


export type CourseDetailsResponse = {
  id: string;
  title: string;
  description: string;
  modules: any[]; 
};

export const fetchCourseByIdThunk = createAsyncThunk<
  CourseDetailsResponse,
  string,
  { rejectValue: string }
>('courseDetails/fetchById', async (courseId, { rejectWithValue }) => {
  try {
    const res = await apiInstance.get<CourseDetailsResponse>(`/courses/${courseId}`);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Network error while loading course details';
    return rejectWithValue(message);
  }
});