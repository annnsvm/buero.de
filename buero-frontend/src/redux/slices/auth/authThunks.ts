import type { LoginPayload, SignUpPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUser } from '../user/userSlice';

export const loginThunk = createAsyncThunk<void, LoginPayload>(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post('/auth/login', { email, password });
      dispatch(addUser(result.data.user));
      return;
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
            ? error.message
            : 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const signupThunk = createAsyncThunk<void, SignUpPayload>(
  'auth/signup',
  async (
    { email, password, role = 'student', language = 'en' },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post('/auth/register', {
        email,
        password,
        role,
        language,
      });
      dispatch(addUser(result.data.user));
      return;
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
            ? error.message
            : 'Sign up failed';
      return rejectWithValue(message);
    }
  },
);
