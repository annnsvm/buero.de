import { AuthState } from '@/types/redux/auth.types';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  loginThunk,
  logOutThunk,
  refreshUserThunk,
  resendSignupCodeThunk,
  startSignupThunk,
  verifySignupThunk,
} from './authThunks';

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  error: null,
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
  },
  extraReducers: (builder) =>
    builder
      .addCase(logOutThunk.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = false;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(loginThunk.fulfilled, verifySignupThunk.fulfilled, refreshUserThunk.fulfilled),
        (state) => {
          state.status = 'idle';
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addMatcher(isAnyOf(startSignupThunk.fulfilled, resendSignupCodeThunk.fulfilled), (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          loginThunk.pending,
          startSignupThunk.pending,
          verifySignupThunk.pending,
          resendSignupCodeThunk.pending,
          logOutThunk.pending,
          refreshUserThunk.pending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          loginThunk.rejected,
          startSignupThunk.rejected,
          verifySignupThunk.rejected,
          resendSignupCodeThunk.rejected,
          logOutThunk.rejected,
          refreshUserThunk.rejected,
        ),
        (state, action) => {
          state.status = 'error';
          state.error = String(action.payload);
        },
      ),
});

export const authReducer = authSlice.reducer;
export const { resetAuthError, logout } = authSlice.actions;
