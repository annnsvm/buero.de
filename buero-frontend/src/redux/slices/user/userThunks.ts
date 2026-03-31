import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { mapUserMeResponseToCurrentUser } from '@/helpers/mapUserMeResponse';
import type { CurrentUser } from '@/types/redux/currentUser.types';
import type { PatchUserProfilePayload } from '@/types/api/userMe.types';

export const fetchCurrentUserThunk = createAsyncThunk<
  CurrentUser,
  void,
  { rejectValue: string }
>('user/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    const { apiInstance } = await import('@/api/apiInstance');
    const { data } = await apiInstance.get(API_ENDPOINTS.users.me);
    return mapUserMeResponseToCurrentUser(data);
  } catch (error: unknown) {
    return rejectWithValue(error, 'Failed to load profile');

  }
});

export const patchUserProfileThunk = createAsyncThunk<
  CurrentUser,
  PatchUserProfilePayload,
  { rejectValue: string }
>('user/patchProfile', async (payload, { rejectWithValue }) => {
  try {
    const { apiInstance } = await import('@/api/apiInstance');
    const { data } = await apiInstance.patch(API_ENDPOINTS.users.updateMe, payload);
    return mapUserMeResponseToCurrentUser(data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update profile'));
  }
});
