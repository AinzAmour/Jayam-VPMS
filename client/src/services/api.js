import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jayam_vpms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract error messages & handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized - redirect to login if session expired
      if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('jayam_vpms_token');
        localStorage.removeItem('jayam_vpms_user');
        window.location.href = '/login?session=expired';
      }

      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        'An unexpected server error occurred.';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Cannot connect to server. Please check your network connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
