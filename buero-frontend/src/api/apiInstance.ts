import axios from 'axios';
import { store } from '../redux/store';
import { ROUTES } from '../helpers/routes';

const baseURL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) ||
  'http://localhost:3000/api'; 

export const apiInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  store.dispatch({ type: 'auth/logout' });
  window.location.href = ROUTES.HOME;
};

apiInstance.interceptors.request.use((config) => config);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    if (isRefreshRequest) {
      handleLogout();
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      handleLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiInstance.post('/auth/refresh', {}, { withCredentials: true });

      processQueue(null);
      return apiInstance(originalRequest);
    } catch (err) {
      processQueue(err);
      handleLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
