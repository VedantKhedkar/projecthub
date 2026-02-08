import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend port
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');

    // 2. If user exists, attach the token to headers
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;