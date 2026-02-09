import React, { createContext, useState, useEffect } from 'react';
// 1. Import your custom api instance
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page refresh)
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Failed to parse userInfo:", error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // 2. Updated Login Function using 'api' instance
  const login = async (email, password) => {
    try {
      // Axios uses the baseURL from api.js automatically
      const res = await api.post('/users/login', { email, password });
      
      const data = res.data;

      // Axios considers any 2xx status as "ok"
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
      
    } catch (error) {
      // Capture the "pending admin approval" or "Invalid credentials" message
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, message: errorMessage };
    }
  };

  // 3. Updated Register Function using 'api' instance
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/users', { name, email, password });
      
      return { 
        success: true, 
        message: res.data.message || "Registration successful! Your account is pending admin approval." 
      };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  };

  // 4. Logout Function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;