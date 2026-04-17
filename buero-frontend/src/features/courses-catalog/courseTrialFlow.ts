import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import {
  PENDING_TRIAL_KEY,
  clearPendingCheckoutSession,
} from '@/helpers/sessionPendingAuth';
import { ROUTES, getCoursePath } from '@/helpers/routes';
import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import type { AppDispatch } from '@/redux/store';
import type { NavigateFunction } from 'react-router-dom';

export { PENDING_TRIAL_KEY } from '@/helpers/sessionPendingAuth';

export const startCourseTrialRequest = async (courseId: string): Promise<void> => {
  await apiInstance.post(API_ENDPOINTS.courses.startTrial(courseId));
};

export const consumePendingCourseTrial = async (
  navigate: NavigateFunction,
  dispatch: AppDispatch,
): Promise<boolean> => {
  const raw = sessionStorage.getItem(PENDING_TRIAL_KEY);
  if (!raw) return false;
  sessionStorage.removeItem(PENDING_TRIAL_KEY);
  let courseId: string | undefined;
  try {
    courseId = (JSON.parse(raw) as { courseId?: string }).courseId;
  } catch {
    return false;
  }
  if (!courseId) return false;
  try {
    await startCourseTrialRequest(courseId);
    void dispatch(fetchCoursesCatalogThunk());
    navigate(getCoursePath(courseId));
    return true;
  } catch {
    navigate(ROUTES.COURSES);
    return true;
  }
};

export const requestCourseTrial = async (
  courseId: string,
  isAuthenticated: boolean,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
): Promise<void> => {
  if (!isAuthenticated) {
    clearPendingCheckoutSession();
    sessionStorage.setItem(PENDING_TRIAL_KEY, JSON.stringify({ courseId }));
    dispatch(
      openGlobalModal({
        type: 'login',
        redirectTo: ROUTES.COURSES,
      }),
    );
    return;
  }
  try {
    await startCourseTrialRequest(courseId);
    void dispatch(fetchCoursesCatalogThunk());
    navigate(getCoursePath(courseId));
  } catch {
    navigate(ROUTES.COURSES);
  }
};
