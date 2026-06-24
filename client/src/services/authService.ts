import { apiClient } from './apiClient';
import type { User } from '../types';

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  token?: string; // only in dev mode
  info?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface GetMeResponse {
  user: User;
}

export const authService = {
  async signup(name: string, email: string, password: string, role: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  async resetPassword(email: string, token: string, password: string): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
      email,
      token,
      password,
    });
    return response.data;
  },

  async getMe(): Promise<GetMeResponse> {
    const response = await apiClient.get<GetMeResponse>('/auth/me');
    return response.data;
  },
};
