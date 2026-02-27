import { createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  isAuthenticated: boolean;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: () => {},
});

export const authReducer = authSlice.reducer;
export const { resetAuthError } = authSlice.actions;
