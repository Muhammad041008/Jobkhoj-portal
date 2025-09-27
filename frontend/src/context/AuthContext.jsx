import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook to use AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component that wraps the app and provides auth state/actions
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'employer' or 'jobseeker'

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get user info
          const userInfo = await authService.getProfile();
          setUser(userInfo);
          setIsAuthenticated(true);
          setUserType(userInfo.role);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Create user object with correct structure
      const userData = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      };
      
      // Set auth state
      setUser(userData);
      setIsAuthenticated(true);
      setUserType(response.role);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setUserType(null);
      authService.logout(); // Call logout API if needed
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  // Reset password
  const resetPassword = async (passwordData) => {
    try {
      await authService.resetPassword(passwordData);
      return { success: true };
    } catch (error) {
      console.error('Failed to reset password:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error('Failed to send reset email:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    userType,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};