import { createSlice } from "@reduxjs/toolkit";

export type CoursesCatalogState = {
  items: unknown[];
  totalCount: number;
  filters: { level?: string; category?: string; search?: string };
  page: number;
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: CoursesCatalogState = {
  items: [],
  totalCount: 0,
  filters: {},
  page: 1,
  status: "idle",
  error: null,
};

const coursesCatalogSlice = createSlice({
  name: "coursesCatalog",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1;
    },
    setPage: (state, action: { payload: number }) => {
      state.page = action.payload;
    },
  },
  extraReducers: () => {},
});

export const coursesCatalogReducer = coursesCatalogSlice.reducer;
export const { setFilters, setPage } = coursesCatalogSlice.actions;
