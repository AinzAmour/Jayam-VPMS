import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import BootScreen from '../components/BootScreen';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // read initial session from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jayam_vpms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jayam_vpms_token'));
  const [isLoading, setIsLoading] = useState(true);

  // verify token on mount and refresh profile
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jayam_vpms_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('jayam_vpms_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { token: receivedToken, user: loggedInUser } = response.data;

    setToken(receivedToken);
    setUser(loggedInUser);
    localStorage.setItem('jayam_vpms_token', receivedToken);
    localStorage.setItem('jayam_vpms_user', JSON.stringify(loggedInUser));

    return loggedInUser;
  };

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
      {isLoading ? <BootScreen /> : children}
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
