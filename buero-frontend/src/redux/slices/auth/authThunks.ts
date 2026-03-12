import type { LoginPayload, SignUpPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUser } from '../user/userSlice';
import { setAccessToken } from './authSlice';
import { getCookie } from '@/helpers/cookies';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export const loginThunk = createAsyncThunk<void, LoginPayload>(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post(API_ENDPOINTS.auth.login, { email, password });
      if (result.data?.user) {
        dispatch(addUser(result.data.user));
      }

      const tokenFromCookie = getCookie('access_token');
      if (tokenFromCookie) {
        dispatch(setAccessToken(tokenFromCookie));
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
      const tokenFromCookie = getCookie('access_token');
      if (tokenFromCookie) {
        dispatch(setAccessToken(tokenFromCookie));
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
  'auth/logout', async(_, {dispatch, rejectWithValue}) => 
  {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      await apiInstance.post(API_ENDPOINTS.auth.logout);
      dispatch(setAccessToken(null));
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
  });