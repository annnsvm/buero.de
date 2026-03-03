import { createSlice } from "@reduxjs/toolkit";

export type CourseLearningState = {
  course: unknown | null;
  materials: unknown[];
  currentMaterialId: string | null;
  progress: unknown[];
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: CourseLearningState = {
  course: null,
  materials: [],
  currentMaterialId: null,
  progress: [],
  status: "idle",
  error: null,
};

const courseLearningSlice = createSlice({
  name: "courseLearning",
  initialState,
  reducers: {
    setCurrentMaterialId: (state, action: { payload: string | null }) => {
      state.currentMaterialId = action.payload;
    },
    clearCourseLearning: () => initialState,
  },
  extraReducers: () => {},
});

export const courseLearningReducer = courseLearningSlice.reducer;
export const { setCurrentMaterialId, clearCourseLearning } =
  courseLearningSlice.actions;
