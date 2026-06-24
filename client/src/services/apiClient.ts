import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;
if (!VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is not defined.');
}

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If you need cookies, you can set withCredentials: true
  withCredentials: true,
});

// Request interceptor to automatically attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_access_token') || sessionStorage.getItem('nexus_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors uniformly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract a user-friendly error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';
    
    // Create a normalized error object to propagate
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);
