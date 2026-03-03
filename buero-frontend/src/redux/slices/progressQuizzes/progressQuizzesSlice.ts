import { createSlice } from "@reduxjs/toolkit";

export type ProgressQuizzesState = {
  overallProgress: unknown | null;
  courseProgressById: Record<string, unknown>;
  currentQuizAttemptId: string | null;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: ProgressQuizzesState = {
  overallProgress: null,
  courseProgressById: {},
  currentQuizAttemptId: null,
  status: "idle",
  error: null,
};

const progressQuizzesSlice = createSlice({
  name: "progressQuizzes",
  initialState,
  reducers: {
    setCurrentQuizAttemptId: (state, action: { payload: string | null }) => {
      state.currentQuizAttemptId = action.payload;
    },
  },
  extraReducers: () => {},
});

export const progressQuizzesReducer = progressQuizzesSlice.reducer;
export const { setCurrentQuizAttemptId } = progressQuizzesSlice.actions;
