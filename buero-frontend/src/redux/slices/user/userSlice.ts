import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  currentUser: {
    id: string;
    email: string;
    role: "student" | "teacher";
    language: string;
    avatarUrl?: string;
  } | null;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: UserState = {
  currentUser: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: () => {},
});

export const userReducer = userSlice.reducer;
export const { clearUser } = userSlice.actions;
