import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CurrentUser } from '@/types/redux/currentUser.types';
import { fetchCurrentUserThunk, patchUserProfileThunk } from './userThunks';

export type { CurrentUser };


export type UserState = {
  currentUser: {
    id: string;
    email: string;
    role: 'student' | 'teacher';
    language: string;
    avatarUrl?: string;
  } | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
};

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CurrentUser } from '@/types/redux/currentUser.types';
import { fetchCurrentUserThunk, patchUserProfileThunk } from './userThunks';

export type { CurrentUser };

export type UserState = {
  currentUser: CurrentUser | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
};

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
    addUser(state, action: PayloadAction<CurrentUser | null>) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message ?? 'Failed to load user';
      })
      .addCase(patchUserProfileThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(patchUserProfileThunk.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.currentUser = action.payload;
      })
      .addCase(patchUserProfileThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message ?? 'Update failed';
      }),
});

export const userReducer = userSlice.reducer;
export const { clearUser, addUser } = userSlice.actions;
