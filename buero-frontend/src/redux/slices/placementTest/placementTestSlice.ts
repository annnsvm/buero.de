import { createSlice } from "@reduxjs/toolkit";

export type PlacementTestState = {
  questions: unknown[];
  answers: Record<string, string>;
  resultLevel: "A1" | "A2" | "B1" | "B2" | null;
  status: "idle" | "loading" | "submitting" | "completed";
  error: string | null;
};

const initialState: PlacementTestState = {
  questions: [],
  answers: {},
  resultLevel: null,
  status: "idle",
  error: null,
};

const placementTestSlice = createSlice({
  name: "placementTest",
  initialState,
  reducers: {
    resetPlacementTest: () => initialState,
  },
  extraReducers: () => {},
});

export const placementTestReducer = placementTestSlice.reducer;
export const { resetPlacementTest } = placementTestSlice.actions;
