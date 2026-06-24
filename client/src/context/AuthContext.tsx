import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import { authService } from '../services';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Auth State consistently from the correct storage source
  useEffect(() => {
    const isLocal = !!localStorage.getItem('nexus_access_token');
    const storage = isLocal ? localStorage : sessionStorage;

    const storedAccessToken = storage.getItem('nexus_access_token');
    const storedUser = storage.getItem('nexus_user');

    if (storedAccessToken && storedUser) {
      setToken(storedAccessToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Listen for global logout events triggered by axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth_logout', handleAuthLogout);
    return () => window.removeEventListener('auth_logout', handleAuthLogout);
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const data = await authService.login(email, password);

      setToken(data.accessToken);
      setUser(data.user);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('nexus_access_token', data.accessToken);
      storage.setItem('nexus_refresh_token', data.refreshToken);
      storage.setItem('nexus_user', JSON.stringify(data.user));

      return { success: true, message: data.message || 'Logged in successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const data = await authService.signup(name, email, password, role);

      setToken(data.accessToken);
      setUser(data.user);

      // Default to session storage on register, can be changed
      sessionStorage.setItem('nexus_access_token', data.accessToken);
      sessionStorage.setItem('nexus_refresh_token', data.refreshToken);
      sessionStorage.setItem('nexus_user', JSON.stringify(data.user));

      return { success: true, message: data.message || 'Signed up successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const data = await authService.forgotPassword(email);

      return {
        success: true,
        message: data.message || 'Reset code sent',
        token: data.token, // Returned in dev mode for easy manual copy-pasting
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const resetPassword = async (email: string, token: string, password: string) => {
    try {
      const data = await authService.resetPassword(email, token, password);

      return { success: true, message: data.message || 'Password reset successful' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('nexus_refresh_token') || sessionStorage.getItem('nexus_refresh_token');
    
    // Revoke refresh token on backend asynchronously (fire-and-forget for instant UI update)
    if (refreshToken) {
      authService.logout(refreshToken).catch((err) => {
        console.error('Error revoking token on server:', err);
      });
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('nexus_access_token');
    localStorage.removeItem('nexus_refresh_token');
    localStorage.removeItem('nexus_user');
    sessionStorage.removeItem('nexus_access_token');
    sessionStorage.removeItem('nexus_refresh_token');
    sessionStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
