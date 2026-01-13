import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          
          // Verify token is still valid BEFORE setting authenticated
          const response = await authAPI.getMe();
          
          // Only set authenticated if token verification succeeds
          setUser(response.data.data);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data.data;

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      // Don't modify state on failed login - just return error
      // This prevents unwanted re-renders and navigation
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, ...userData } = response.data.data;

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Don't modify state on failed registration - just return error
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
