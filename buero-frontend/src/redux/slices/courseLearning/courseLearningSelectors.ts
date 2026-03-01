import type { RootState } from "../../store";

export const selectCourseLearningCourse = (state: RootState) =>
  state.courseLearning.course;
export const selectCourseLearningMaterials = (state: RootState) =>
  state.courseLearning.materials;
export const selectCurrentMaterialId = (state: RootState) =>
  state.courseLearning.currentMaterialId;
export const selectCourseLearningStatus = (state: RootState) =>
  state.courseLearning.status;
