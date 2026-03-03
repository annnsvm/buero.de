import { createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: { payload: string | null }) => {
      state.accessToken = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    resetAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: () => {},
});

export const authReducer = authSlice.reducer;
export const { setAccessToken, resetAuthError, logout } = authSlice.actions;
