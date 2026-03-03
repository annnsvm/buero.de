import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: fetchCurrentUser when API /users/me is ready

export const fetchCurrentUserThunk = createAsyncThunk(
  "user/fetchCurrent",
  async () => {
    return null;
  }
);
