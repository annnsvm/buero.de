import type { LoginPayload, SignUpPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUser } from '../user/userSlice';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { RootState } from '@/types/redux/store.types';

export const loginThunk = createAsyncThunk<void, LoginPayload>(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post(API_ENDPOINTS.auth.login, { email, password });
      if (result.data?.user) {
        dispatch(addUser(result.data.user));
      }
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
  async ({ email, password, role = 'student', language = 'en' }, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post(API_ENDPOINTS.auth.register, {
        email,
        password,
        role,
        language,
      });
      if (result.data?.user) {
        dispatch(addUser(result.data.user));
      }
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

export const logOutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      await apiInstance.post(API_ENDPOINTS.auth.logout);
      dispatch(addUser(null));
      return;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
            ? error.message
            : 'Logout failed';
      return rejectWithValue(message);
    }
  },
);

export const refreshUserThunk = createAsyncThunk<void, void>(
  'auth/refreshUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.get(API_ENDPOINTS.users.me);
      if (result.data?.user) {
        dispatch(addUser(result.data.user));
      }
      return;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
            ? error.message
            : 'Refresh failed';
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const isLoggedIn  = state.auth.isAuthenticated;
      if (!isLoggedIn) return false;
      return true;
    },
  },
);
