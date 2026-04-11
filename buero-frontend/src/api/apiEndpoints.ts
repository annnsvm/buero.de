export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login', 
    refresh: '/auth/refresh', 
    logout: '/auth/logout', 
  },
  users: {
    me: '/users/me', 
    updateMe: '/users/me',
  },
  courses: {
    list: '/courses',
    manage: '/courses/manage',
    my: '/courses/me',
    byId: (id: string) => `/courses/${id}`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
    cover: (id: string) => `/courses/${id}/cover`,
  },
  courseMaterials: {
    list: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}/materials`,
    byId: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
    create: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}/materials`,
    update: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
    delete: (courseId: string, moduleId: string, id: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${id}`,
  },
  courseModules: {
    list: (courseId: string) => `/courses/${courseId}/modules`,
    create: (courseId: string) => `/courses/${courseId}/modules`,
    update: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}`,
    delete: (courseId: string, moduleId: string) => `/courses/${courseId}/modules/${moduleId}`,
  },
  subscriptions: {
    checkout: '/subscriptions/checkout',
    syncCheckout: '/subscriptions/sync-checkout',
    myAccess: '/subscriptions/me', 
    portal: '/subscriptions/portal', 
  },
  payments: {
    myPayments: '/payments/me',
  },
  quiz: {
    startAttempt: '/quiz/attempts',
    getAttempt: (attemptId: string) => `/quiz/attempts/${attemptId}`,
    submit: (attemptId: string) => `/quiz/attempts/${attemptId}/submit`,
  },
  progress: {
    course: (courseId: string) => `/courses/${courseId}/progress`,
    complete: (courseId: string, moduleId: string, materialId: string) =>
      `/courses/${courseId}/modules/${moduleId}/materials/${materialId}/complete`,
  },
} as const;

export const PUBLIC_ENDPOINT_PREFIXE = [
    API_ENDPOINTS.auth.login,
    API_ENDPOINTS.auth.register,
    API_ENDPOINTS.auth.refresh,
    API_ENDPOINTS.auth.logout,
    API_ENDPOINTS.courses.list
] as const;
