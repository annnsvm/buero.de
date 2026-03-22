import axios from 'axios';
import { getStore } from '../redux/storeRef';
import { API_ENDPOINTS, PUBLIC_ENDPOINT_PREFIXE } from './apiEndpoints';
import { logout } from '@/redux/slices/auth';

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

const refreshInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINT_PREFIXE.some((prefix) => url.startsWith(prefix));
};

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
  getStore().dispatch(logout());
};

apiInstance.interceptors.request.use((config) => {
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const url: string | undefined = originalRequest?.url;

    if (isPublicEndpoint(url)) {
      return Promise.reject(error);
    }
    const state = getStore().getState();
    const hasSession = Boolean(state.auth?.isAuthenticated);
    if (!hasSession) {
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
      await refreshInstance.post(API_ENDPOINTS.auth.refresh, {});

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
