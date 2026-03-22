import type { RootState } from '../../rootReducer';

export const selectPlacementQuestions = (state: RootState) => state.placementTest.questions;
export const selectPlacementResultLevel = (state: RootState) => state.placementTest.resultLevel;
export const selectPlacementTestStatus = (state: RootState) => state.placementTest.status;
