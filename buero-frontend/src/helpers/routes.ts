
export const ROUTES = Object.freeze({
  HOME: "/",
  ASSESSMENT: "/assessment",
  RESULTS: "/results",
  AUTH: "/auth",
  TRIAL_DASHBOARD: "/dashboard/trial",
  SUBSCRIBED_DASHBOARD: "/dashboard/subscribed",
  TEACHERS: "/teachers",
  SETTINGS_ACCOUNT: "/settings/account",
  COURSES: "/courses",
  COURSE: "/courses/:courseId",
  PROFILE: "/profile",
  NOT_FOUND: "/404",
} as const);

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];


export const getCoursePath = (courseId: string): string => `/courses/${courseId}`;
