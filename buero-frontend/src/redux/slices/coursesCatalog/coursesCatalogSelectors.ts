import type { RootState } from "../../store";

export const selectCoursesCatalogItems = (state: RootState) =>
  state.coursesCatalog.items;
export const selectCoursesCatalogStatus = (state: RootState) =>
  state.coursesCatalog.status;
export const selectCoursesCatalogFilters = (state: RootState) =>
  state.coursesCatalog.filters;
