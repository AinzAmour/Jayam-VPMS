import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Hydrate initial auth state synchronously from localStorage to prevent flash of unauthenticated UI
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jayam_vpms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jayam_vpms_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Validate stored JWT on initial mount and synchronize latest profile from server
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jayam_vpms_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('jayam_vpms_user', JSON.stringify(res.data));
        } catch (err) {
          // Token expired or account disabled — clear stale session
          console.warn('Session restoration failed:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Authenticate user with email and password, persist token, and update context.
   */
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { token: receivedToken, user: loggedInUser } = response.data;

    setToken(receivedToken);
    setUser(loggedInUser);
    localStorage.setItem('jayam_vpms_token', receivedToken);
    localStorage.setItem('jayam_vpms_user', JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  /**
   * Clear auth session and remove credentials from localStorage.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jayam_vpms_token');
    localStorage.removeItem('jayam_vpms_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
