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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('🔍 AuthContext init - Token found:', !!token);
      console.log('🔍 AuthContext init - User found:', !!savedUser);

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Validate that we have essential user data
          if (userData && userData.id && userData.username) {
            setUser(userData);
            console.log('👤 User loaded from localStorage:', userData);
            
            // Validate token in background
            await validateTokenSilently();
          } else {
            console.warn('⚠️ Invalid user data in localStorage');
            await clearAuthData();
          }
        } catch (parseError) {
          console.error('❌ Error parsing saved user:', parseError);
          await clearAuthData();
        }
      } else if (token) {
        console.log('🔄 Token found but no saved user, validating...');
        await checkAuthStatus();
      } else {
        console.log('❌ No authentication data found');
      }
    } catch (error) {
      console.error('❌ Auth initialization failed:', error);
      await clearAuthData();
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const validateTokenSilently = async () => {
    try {
      const response = await apiService.getProfile();
      if (response && response.user) {
        // Update user data if it has changed
        const updatedUser = response.user;
        setUser(prevUser => {
          if (JSON.stringify(prevUser) !== JSON.stringify(updatedUser)) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
          }
          return prevUser;
        });
        setError(null);
      } else {
        throw new Error('Invalid profile response');
      }
    } catch (error) {
      console.warn('⚠️ Silent token validation failed:', error.message);
      // Don't clear auth data on silent validation failure
      // Only clear if it's a 401/403 error indicating invalid token
      if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Unauthorized')) {
        await clearAuthData();
        setError('Your session has expired. Please log in again.');
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log('📡 Calling /api/auth/profile...');
      const response = await apiService.getProfile();
      console.log('✅ Profile response:', response);

      if (response && response.user) {
        const userData = response.user;
        console.log('👤 Setting user:', userData);
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setError(null);
      } else {
        throw new Error('No user data received from server');
      }
    } catch (error) {
      console.error('❌ Profile check failed:', error.message);
      await clearAuthData();
      setError(getErrorMessage(error.message));
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate credentials
      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required');
      }

      console.log('🔐 Attempting login for:', credentials.username);
      const response = await apiService.login(credentials);

      if (!response.token || !response.user) {
        throw new Error('Invalid login response from server');
      }

      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setError(null);
      
      console.log('✅ Login successful:', response.user.username);
      return response;
      
    } catch (error) {
      const errorMessage = getErrorMessage(error.message);
      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
      
      // Clear any partial auth data
      await clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate registration data
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Username, email, and password are required');
      }

      console.log('📝 Attempting registration for:', userData.username);
      const response = await apiService.register(userData);

      if (!response.token || !response.user) {
        throw new Error('Invalid registration response from server');
      }

      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setError(null);
      
      console.log('✅ Registration successful:', response.user.username);
      return response;
      
    } catch (error) {
      const errorMessage = getErrorMessage(error.message);
      console.error('❌ Registration failed:', errorMessage);
      setError(errorMessage);
      
      // Clear any partial auth data
      await clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user:', user?.username);
      
      // Optional: Call logout endpoint to invalidate token on server
      // await apiService.logout();
      
      await clearAuthData();
      console.log('✅ Logout completed');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local data even if server call fails
      await clearAuthData();
    }
  };

  const clearAuthData = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const getErrorMessage = (error) => {
    if (typeof error !== 'string') {
      return 'An unexpected error occurred';
    }

    // Map common error messages to user-friendly ones
    const errorMap = {
      'Username and password are required': 'Please enter both username and password',
      'Invalid credentials': 'Invalid username or password',
      'User not found': 'Invalid username or password',
      'Invalid password': 'Invalid username or password',
      'Username already exists': 'This username is already taken',
      'Email already exists': 'This email is already registered',
      'Network Error': 'Connection error. Please check your internet connection',
      'Session expired': 'Your session has expired. Please log in again',
      'Unauthorized': 'Your session has expired. Please log in again',
      '401': 'Your session has expired. Please log in again',
      '403': 'Access denied. Please log in again',
      '500': 'Server error. Please try again later',
      'Failed to fetch': 'Connection error. Please check your internet connection'
    };

    // Check for exact matches first
    if (errorMap[error]) {
      return errorMap[error];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Return the original error if no mapping found
    return error;
  };

  const updateUser = (updatedUserData) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const refreshUser = async () => {
    if (user) {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout,
    clearError,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
