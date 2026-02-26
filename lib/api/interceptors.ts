import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { CustomAxiosRequestConfig } from '@/types/components/common';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseErrorInterceptor = async (error: AxiosError, apiInstance: any) => {
  const originalRequest = error.config as CustomAxiosRequestConfig;

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const accessToken = res.data.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      processQueue(null, accessToken);
      return apiInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};