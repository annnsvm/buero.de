import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ProfileTab = 'overview' | 'courses' | 'settings' | 'lessonRequests';

export type ProfileViewState = {
  activeTab: ProfileTab;
};

const initialState: ProfileViewState = {
  activeTab: 'overview',
};

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    setProfileActiveTab: (state, action: PayloadAction<ProfileTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const profileViewReducer = profileViewSlice.reducer;
export const { setProfileActiveTab } = profileViewSlice.actions;
