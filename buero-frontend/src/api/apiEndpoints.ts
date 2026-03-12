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
    byId: (id: string) => `/courses/${id}`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`, 
    delete: (id: string) => `/courses/${id}`, 
  },
  courseMaterials: {
    list: (courseId: string) => `/courses/${courseId}/materials`,
    byId: (courseId: string, id: string) => `/courses/${courseId}/materials/${id}`, 
    create: (courseId: string) => `/courses/${courseId}/materials`, 
    update: (courseId: string, id: string) => `/courses/${courseId}/materials/${id}`, 
    delete: (courseId: string, id: string) => `/courses/${courseId}/materials/${id}`, 
  },
  subscriptions: {
    checkout: '/subscriptions/checkout',
    myAccess: '/subscriptions/me', 
    portal: '/subscriptions/portal', 
  },
  payments: {
    myPayments: '/payments/me',
  },
} as const;

export const PUBLIC_ENDPOINT_PREFIXE = [
    API_ENDPOINTS.auth.login,
    API_ENDPOINTS.auth.register,
    API_ENDPOINTS.auth.refresh,
    API_ENDPOINTS.auth.logout,
    API_ENDPOINTS.courses.list
] as const;
