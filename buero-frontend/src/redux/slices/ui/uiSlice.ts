import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  globalLoading: boolean;
};

const initialState: UiState = {
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading: (state, action: { payload: boolean }) => {
      state.globalLoading = action.payload;
    },
  },
});

export const uiReducer = uiSlice.reducer;
export const { setGlobalLoading } = uiSlice.actions;
