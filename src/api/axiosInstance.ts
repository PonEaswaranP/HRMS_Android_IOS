// api/axiosInstance.ts
import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const BASE_URL = 'http://192.168.1.54:8000/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          await tokenStorage.clearTokens();
          return Promise.reject(error);
        }

        const response = await axios.post(
          'http://192.168.1.54:8000/api/token/refresh/',
          { refresh: refreshToken }
        );

        const { access } = response.data;
        await tokenStorage.setTokens(access, refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
