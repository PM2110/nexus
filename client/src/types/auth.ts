export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; token?: string }>;
  resetPassword: (email: string, token: string, password: string) => Promise<{ success: boolean; message: string }>;
  setSession: (accessToken: string, refreshToken: string, userData: User, remember: boolean) => void;
  logout: () => void;
}
