import { AuthState } from '@/types/redux/auth.types';
import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, signupThunk } from './authThunks';

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  error: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(signupThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) ?? 'Sign up failed';
      }),
});

export const authReducer = authSlice.reducer;
export const { resetAuthError, logout, setAccessToken } = authSlice.actions;
