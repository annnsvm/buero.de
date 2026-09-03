import type { LoginPayload, SignUpPayload, VerifySignupPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUser } from '../user/userSlice';
import { resetCoursesCatalog } from '../coursesCatalog/coursesCatalogSlice';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { RootState } from '@/redux/rootReducer';
import { getErrorMessage } from '@/helpers/getErrorMessage';

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
      const message = getErrorMessage(error, 'Login failed');
      return rejectWithValue(message);
    }
  },
);

export const startSignupThunk = createAsyncThunk<{ email: string }, SignUpPayload>(
  'auth/startSignup',
  async (
    { name, email, password, role = 'student', language = 'en', locale = 'en' },
    { rejectWithValue },
  ) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post(API_ENDPOINTS.auth.register, {
        name,
        email,
        password,
        role,
        language,
        locale,
      });
      return { email: result.data?.email ?? email };
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Signup failed');
      return rejectWithValue(message);
    }
  },
);

export const verifySignupThunk = createAsyncThunk<void, VerifySignupPayload>(
  'auth/verifySignup',
  async ({ email, code }, { dispatch, rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      const result = await apiInstance.post(API_ENDPOINTS.auth.verifyRegistration, {
        email,
        code,
      });
      if (result.data?.user) {
        dispatch(addUser(result.data.user));
      }
      return;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Verification failed');
      return rejectWithValue(message);
    }
  },
);

export const resendSignupCodeThunk = createAsyncThunk<void, { email: string }>(
  'auth/resendSignupCode',
  async ({ email }, { rejectWithValue }) => {
    try {
      const { apiInstance } = await import('@/api/apiInstance');
      await apiInstance.post(API_ENDPOINTS.auth.resendRegistrationCode, { email });
      return;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Could not resend code');
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
      dispatch(resetCoursesCatalog());
      return;
    } catch (error) {
      const message = getErrorMessage(error, 'Logout failed');
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
      const message = getErrorMessage(error, 'Failed to refresh user');
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (!state.auth.isAuthenticated) return false;
      if (state.user.currentUser) return false;
      if (state.auth.status === 'loading') return false;
      return true;
    },
  },
);
