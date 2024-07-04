import axios from 'axios';

export const instance = axios.create({
  withCredentials: JSON.parse(String(process.env.REACT_APP_CREDENTIALS)),
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = { ...error.config };
    originalRequest._isRetry = true;
    throw error;
  },
);
