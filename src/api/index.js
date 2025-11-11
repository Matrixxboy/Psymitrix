import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType');
    if (token && tokenType) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export * from './auth.js';
export * from './sessions.js';
export * from './notifications.js';
export * from './achievements.js';
export * from './wellness.js';
