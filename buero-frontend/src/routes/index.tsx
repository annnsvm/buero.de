import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { ROUTES } from "../helpers/routes";
import SharedLayout from "../components/layout/SharedLayout/SharedLayout";
import PublicGuard from "../components/guards/PublicGuard/PublicGuard";
import PrivateGuard from "../components/guards/PrivateGuard/PrivateGuard";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const AssessmentPage = lazy(() => import("../pages/AssessmentPage/AssessmentPage"));
const ResultsPage = lazy(() => import("../pages/ResultsPage/ResultsPage"));
const AuthPage = lazy(() => import("../pages/AuthPage/AuthPage"));
const TrialDashboardPage = lazy(
  () => import("../pages/TrialDashboardPage/TrialDashboardPage")
);
const SubscribedDashboardPage = lazy(
  () => import("../pages/SubscribedDashboardPage/SubscribedDashboardPage")
);
const TeacherDirectoryPage = lazy(
  () => import("../pages/TeacherDirectoryPage/TeacherDirectoryPage")
);
const AccountSettingsPage = lazy(
  () => import("../pages/AccountSettingsPage/AccountSettingsPage")
);
const CoursesCatalogPage = lazy(
  () => import("../pages/CoursesCatalogPage/CoursesCatalogPage")
);
const CoursePage = lazy(() => import("../pages/CoursePage/CoursePage"));
const UserProfilePage = lazy(
  () => import("../pages/UserProfilePage/UserProfilePage")
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));

const PageFallback = () => <div>Loading...</div>;

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<PageFallback />}>
        <SharedLayout />
      </Suspense>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: ROUTES.ASSESSMENT,
        element: (
          <PublicGuard>
            <AssessmentPage />
          </PublicGuard>
        ),
      },
      {
        path: ROUTES.RESULTS,
        element: (
          <PrivateGuard>
            <ResultsPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.AUTH,
        element: (
          <PublicGuard>
            <AuthPage />
          </PublicGuard>
        ),
      },
      {
        path: ROUTES.TRIAL_DASHBOARD,
        element: (
          <PrivateGuard>
            <TrialDashboardPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.SUBSCRIBED_DASHBOARD,
        element: (
          <PrivateGuard>
            <SubscribedDashboardPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.TEACHERS,
        element: (
          <PrivateGuard>
            <TeacherDirectoryPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.SETTINGS_ACCOUNT,
        element: (
          <PrivateGuard>
            <AccountSettingsPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.COURSES,
        element: (
          <PrivateGuard>
            <CoursesCatalogPage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.COURSE,
        element: (
          <PrivateGuard>
            <CoursePage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <PrivateGuard>
            <UserProfilePage />
          </PrivateGuard>
        ),
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
