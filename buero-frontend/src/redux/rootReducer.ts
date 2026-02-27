import { combineReducers } from "@reduxjs/toolkit";
import { uiReducer } from "./slices/ui/uiSlice";
import { authReducer } from "./slices/auth/authSlice";
import { userReducer } from "./slices/user/userSlice";
import { placementTestReducer } from "./slices/placementTest/placementTestSlice";
import { coursesCatalogReducer } from "./slices/coursesCatalog/coursesCatalogSlice";
import { courseLearningReducer } from "./slices/courseLearning/courseLearningSlice";
import { progressQuizzesReducer } from "./slices/progressQuizzes/progressQuizzesSlice";
import { subscriptionsReducer } from "./slices/subscriptions/subscriptionsSlice";
import { lessonRequestsReducer } from "./slices/lessonRequests/lessonRequestsSlice";

export const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  user: userReducer,
  placementTest: placementTestReducer,
  coursesCatalog: coursesCatalogReducer,
  courseLearning: courseLearningReducer,
  progressQuizzes: progressQuizzesReducer,
  subscriptions: subscriptionsReducer,
  lessonRequests: lessonRequestsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
