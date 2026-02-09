import axios from 'axios';

/**
 * 1. GET THE BACKEND URL
 * In Vercel, this comes from your Environment Variables.
 * Locally, it defaults to http://localhost:5000.
 */
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * 2. CREATE AXIOS INSTANCE
 * We append /api here so all your calls (api.get('/projects')) 
 * automatically point to the correct backend route.
 */
const api = axios.create({
  baseURL: `${backendUrl.replace(/\/$/, "")}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 3. REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to every request 
 * if the user is logged in.
 */
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');

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