export const ROUTES = Object.freeze({
  HOME: '/',
  ASSESSMENT: '/assessment',
  RESULTS: '/results',
  TRIAL_DASHBOARD: '/dashboard/trial',
  SUBSCRIBED_DASHBOARD: '/dashboard/subscribed',
  PURCHES_SUCCESS: '/purchase/success',
  PURCHES_CANCEL: '/purchase/cancel',
  TEACHERS: '/teachers',
  SETTINGS_ACCOUNT: '/settings/account',
  COURSES: '/courses',
  COURSE: '/courses/:courseId',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
} as const);

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const HEADER_LIGHT_PATHS: readonly string[] = [ROUTES.HOME,ROUTES.COURSES];

export const isHeaderLightByPath = (pathname: string): boolean =>
  HEADER_LIGHT_PATHS.some((p) => p === pathname || (p !== '/' && pathname.startsWith(p)));

export const getCoursePath = (courseId: string): string => `/courses/${courseId}`;
