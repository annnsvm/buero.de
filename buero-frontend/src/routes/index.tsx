import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { ROUTES } from '../helpers/routes';
import { ModalProvider } from '../components/modal';
import { GlobalLoader } from '@/components/ui';
import SharedLayout from '../components/layout/SharedLayout/SharedLayout';
import PrivateGuard from '../components/guards/PrivateGuard/PrivateGuard';

const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const AssessmentPage = lazy(() => import('../pages/AssessmentPage/AssessmentPage'));
const ResultsPage = lazy(() => import('../pages/ResultsPage/ResultsPage'));
const TrialDashboardPage = lazy(() => import('../pages/TrialDashboardPage/TrialDashboardPage'));
const SubscribedDashboardPage = lazy(
  () => import('../pages/SubscribedDashboardPage/SubscribedDashboardPage'),
);
const SuccessPurchase = lazy(() => import('../pages/SuccessPurchase/SuccessPurchase'));
const CancelPurchase = lazy(() => import('../pages/CancelPurchase/CancelPurchase'));
const TeacherDirectoryPage = lazy(
  () => import('../pages/TeacherDirectoryPage/TeacherDirectoryPage'),
);
const AccountSettingsPage = lazy(() => import('../pages/AccountSettingsPage/AccountSettingsPage'));
const CoursesCatalogPage = lazy(() => import('../pages/CoursesCatalogPage/CoursesCatalogPage'));
const CoursePage = lazy(() => import('../pages/CoursePage/CoursePage'));
const UserProfilePage = lazy(() => import('../pages/UserProfilePage/UserProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ModalProvider>
        <Outlet />
      </ModalProvider>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <Suspense fallback={<GlobalLoader />}>
            <SharedLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <HomePage /> },
          {
            path: ROUTES.ASSESSMENT,
            element: <AssessmentPage />,
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
            path: ROUTES.TRIAL_DASHBOARD,
            element: (
              <PrivateGuard>
                <TrialDashboardPage />
              </PrivateGuard>
            ),
          },
          {
            path: ROUTES.PURCHES_SUCCESS,
            element: (
              <PrivateGuard>
                <SuccessPurchase />
              </PrivateGuard>
            ),
          },
          {
            path: ROUTES.PURCHES_CANCEL,
            element: (
              <PrivateGuard>
                <CancelPurchase />
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
            element: <CoursesCatalogPage />,
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
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
