import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rawApiUrl = import.meta.env.VITE_API_URL;
if (!rawApiUrl) {
  throw new Error('VITE_API_URL environment variable is not defined.');
}
const API_URL = `${rawApiUrl}/auth`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Auth State from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('nexus_token') || sessionStorage.getItem('nexus_token');
    const storedUser = localStorage.getItem('nexus_user') || sessionStorage.getItem('nexus_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('nexus_token', data.token);
      storage.setItem('nexus_user', JSON.stringify(data.user));

      return { success: true, message: data.message || 'Logged in successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setToken(data.token);
      setUser(data.user);

      // Default to session storage on register, can be changed
      sessionStorage.setItem('nexus_token', data.token);
      sessionStorage.setItem('nexus_user', JSON.stringify(data.user));

      return { success: true, message: data.message || 'Signed up successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request reset');
      }

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
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      return { success: true, message: data.message || 'Password reset successful' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    sessionStorage.removeItem('nexus_token');
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
