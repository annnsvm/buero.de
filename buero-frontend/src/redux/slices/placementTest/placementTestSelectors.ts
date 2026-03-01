import type { RootState } from "../../store";

export const selectPlacementQuestions = (state: RootState) =>
  state.placementTest.questions;
export const selectPlacementResultLevel = (state: RootState) =>
  state.placementTest.resultLevel;
export const selectPlacementTestStatus = (state: RootState) =>
  state.placementTest.status;
