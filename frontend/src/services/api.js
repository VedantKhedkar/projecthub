import axios from 'axios';

/**
 * 1. DETERMINE THE BASE URL
 * Vite environment variables (VITE_) are injected at build time.
 * If VITE_API_URL is missing, we use a fallback to prevent the 
 * frontend from making requests to its own domain.
 */
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/api`;
  }

  // Fallback logic if environment variable is not found
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }

  // Hardcoded production fallback to ensure it never hits the frontend URL
  return 'https://projecthub-backend-ten.vercel.app/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 2. REQUEST INTERCEPTOR
 * Automatically attaches the JWT token from localStorage to 
 * every outgoing request for authenticated routes.
 */
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      try {
        const parsedData = JSON.parse(userInfo);
        const token = parsedData?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo for token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 3. RESPONSE INTERCEPTOR (Optional but Recommended)
 * Useful for handling global errors, like redirecting to login 
 * if a token expires (401 error).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear localStorage and redirect)
      // localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

export default api;