import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: fetchCoursesCatalog when API /courses is ready

export const fetchCoursesCatalogThunk = createAsyncThunk(
  "coursesCatalog/fetch",
  async () => ({ items: [], totalCount: 0 })
);
