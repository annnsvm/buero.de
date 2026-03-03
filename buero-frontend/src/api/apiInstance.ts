import axios, { type InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { selectAccessToken } from "../redux/slices/auth/authSelectors";
import { setAccessToken, logout } from "../redux/slices/auth/authSlice";
import { ROUTES } from "../helpers/routes";

const baseURL: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL) ||
  "http://localhost:3001";

export const apiInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
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
  store.dispatch(logout());
  window.location.href = ROUTES.AUTH;
};

apiInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = selectAccessToken(store.getState());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
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

    return apiInstance
      .post<{ accessToken?: string }>("/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        const newToken = res.data?.accessToken ?? null;
        if (newToken) {
          store.dispatch(setAccessToken(newToken));
        }
        processQueue(null, newToken);
        return apiInstance(originalRequest);
      })
      .catch((err) => {
        processQueue(err, null);
        handleLogout();
        return Promise.reject(err);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }
);
