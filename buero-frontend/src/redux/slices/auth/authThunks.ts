import { apiInstance } from '@/api/apiInstance';
import { LoginPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUser } from '../user/userSlice';

// TODO: login, logout, refresh thunks when API is ready

export const loginThunk = createAsyncThunk<void, LoginPayload>(
  'auth/login',
  async ({ email, password }, {dispatch, rejectWithValue }) => {
    try {
      const result = await apiInstance.post('/auth/login', { email, password });
      dispatch(addUser(result.data.user));
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);
