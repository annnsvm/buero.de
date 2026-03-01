import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: login, logout, refresh thunks when API is ready

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (_credentials: { email: string; password: string }) => {
    return null;
  }
);
