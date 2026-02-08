import axios from 'axios';

// Get the backend URL from environment variables
// Vite requires 'VITE_' prefix. If using Create React App, use 'process.env.REACT_APP_API_URL'
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');

    // 2. If user exists, attach the token to headers
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo from localStorage", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;