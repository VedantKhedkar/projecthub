import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in (on page refresh)
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // 2. Updated Login Function
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return { success: true };
      } else {
        // This will now capture the "Your account is pending admin approval" 
        // message thrown by your updated backend controller.
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: "Server error. Please try again later." };
    }
  };

  // 3. Updated Register Function
  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        // Logic: Return success but inform the UI that approval is needed
        return { 
          success: true, 
          message: "Registration successful! Your account is pending admin approval." 
        };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: "Server error. Please try again later." };
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