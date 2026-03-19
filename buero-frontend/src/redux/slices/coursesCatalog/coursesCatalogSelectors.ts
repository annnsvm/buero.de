import type { RootState } from '../../store';

export const selectCoursesCatalogItems = (state: RootState) => state.coursesCatalog.items;
export const selectCoursesCatalogStatus = (state: RootState) => state.coursesCatalog.status;
export const selectCoursesCatalogIsLoading = (state: RootState) =>
  state.coursesCatalog.status === 'loading';
export const selectCoursesCatalogFilters = (state: RootState) => state.coursesCatalog.filters;
export const selectCoursesCatalogPage = (state: RootState) => state.coursesCatalog.page;
export const selectCoursesCatalogPageSize = (state: RootState) => state.coursesCatalog.pageSize;
export const selectCoursesCatalogTotalCount = (state: RootState) =>
  state.coursesCatalog.totalCount;
export const selectCoursesCatalogError = (state: RootState) => state.coursesCatalog.error;

