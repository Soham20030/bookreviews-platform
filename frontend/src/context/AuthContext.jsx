import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  console.log('🔍 AuthContext init - Token found:', !!token);
  console.log('🔍 AuthContext init - User found:', !!savedUser);
  
  if (token && savedUser) {
    try {
      const user = JSON.parse(savedUser);
      setUser(user); // Set user immediately from localStorage
      console.log('👤 User loaded from localStorage:', user);
      
      // Still validate token in background
      checkAuthStatus();
    } catch (error) {
      console.error('❌ Error parsing saved user:', error);
      localStorage.clear();
      setLoading(false);
    }
  } else if (token) {
    console.log('🔄 Token found but no saved user, validating...');
    checkAuthStatus();
  } else {
    console.log('❌ No token found, user not authenticated');
    setLoading(false);
  }
}, []);

const checkAuthStatus = async () => {
  try {
    console.log('📡 Calling /api/auth/profile...');
    const response = await apiService.getProfile();
    console.log('✅ Profile response:', response);
    
    // Handle user object (not array)
    if (response && response.user) {
      console.log('👤 Setting user:', response.user);
      setUser(response.user);
      setError(null);
    } else {
      throw new Error('No user data received');
    }
  } catch (error) {
    console.error('❌ Profile check failed:', error.message);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('Session expired. Please login again.');
  } finally {
    setLoading(false);
  }
};



  const login = async (credentials) => {
  try {
    setError(null);
    setLoading(true);
    console.log('🔐 Logging in...');
    const response = await apiService.login(credentials);
    
    // Store both token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setUser(response.user);
    console.log('✅ Login successful:', response.user);
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      console.log('📝 Registering...');
      const response = await apiService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      console.log('✅ Registration successful:', response.user);
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const logout = () => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Clear user data too
  setUser(null);
  setError(null);
};


  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
