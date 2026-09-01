import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { mapApiCourseToCourseCard } from '@/api/myLearningCourses';
import type { CatalogCourse } from '@/types/api/myLearningCourses.types';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';
import { getActiveTrialCourseIdFromAccess } from '@/features/courses-catalog/activeTrialFromMyCourses';
import { buildCoursesCatalogQueryString } from './coursesCatalogQueryString';

const CATALOG_CLIENT_TTL_MS = 20_000;

type FetchCoursesResponse = {
  items: CourseCardProps[];
  totalCount: number;
  activeTrialCourseId: string | null;
  fetchKey: string;
};

export type FetchCoursesCatalogArg = {
  force?: boolean;
};

type AccessRow = {
  course_id?: string;
  courseId?: string;
  access_type?: string;
  accessType?: string;
  trial_ends_at?: string | null;
  trialEndsAt?: string | null;
};

const readAccessCourseId = (row: AccessRow): string | null => {
  const id = row.course_id ?? row.courseId;
  return id ? String(id) : null;
};

export const buildCatalogFetchKey = (state: {
  coursesCatalog?: { filters?: unknown };
  user?: { currentUser?: { role?: string } };
  auth?: { isAuthenticated?: boolean };
}): string => {
  const filters = state.coursesCatalog?.filters ?? {};
  const role = state.user?.currentUser?.role;
  return JSON.stringify({
    teacher: role === 'teacher',
    auth: Boolean(state.auth?.isAuthenticated),
    filters,
  });
};

export const fetchCoursesCatalogThunk = createAsyncThunk<
  FetchCoursesResponse,
  FetchCoursesCatalogArg | void,
  { state: any; rejectValue: string }
>(
  'coursesCatalog/fetch',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { filters } = state.coursesCatalog;
    const currentUserRole = state.user?.currentUser?.role as 'student' | 'teacher' | undefined;
    const isTeacherManage = currentUserRole === 'teacher';
    const endpoint = isTeacherManage ? API_ENDPOINTS.courses.manage : API_ENDPOINTS.courses.list;
    const query = buildCoursesCatalogQueryString(filters, isTeacherManage);
    const listUrl = query ? `${endpoint}?${query}` : endpoint;
    const isAuthenticated = Boolean(state.auth?.isAuthenticated);
    const shouldLoadAccess = !isTeacherManage && isAuthenticated;

    try {
      const [res, accessRes] = await Promise.all([
        apiInstance.get<unknown[]>(listUrl),
        shouldLoadAccess
          ? apiInstance.get<AccessRow[]>(API_ENDPOINTS.subscriptions.myAccess)
          : Promise.resolve(null),
      ]);

      const raw = Array.isArray(res.data) ? res.data : [];
      const accessRows = Array.isArray(accessRes?.data) ? accessRes.data : [];
      const accessibleCourseIds = new Set(
        accessRows.map(readAccessCourseId).filter((id): id is string => Boolean(id)),
      );
      const activeTrialCourseId = getActiveTrialCourseIdFromAccess(accessRows);

      const items = raw.map((row) => {
        const card = mapApiCourseToCourseCard(row as CatalogCourse);
        const hasAccess = card.isAdded === true || accessibleCourseIds.has(card.id);
        return { ...card, isAdded: hasAccess };
      });

      return {
        items,
        totalCount: items.length,
        activeTrialCourseId,
        fetchKey: buildCatalogFetchKey(state),
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Network error while loading courses';

      return rejectWithValue(message);
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg?.force) return true;
      const state = getState() as {
        coursesCatalog: {
          lastFetchKey: string | null;
          lastFetchAt: number | null;
          items: unknown[];
        };
      };
      const { lastFetchKey, lastFetchAt, items } = state.coursesCatalog;
      if (!lastFetchAt || items.length === 0) return true;
      if (lastFetchKey !== buildCatalogFetchKey(state)) return true;
      return Date.now() - lastFetchAt >= CATALOG_CLIENT_TTL_MS;
    },
  },
);
