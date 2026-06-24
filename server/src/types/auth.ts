import { Request } from 'express';

export interface User {
  id: string; // Map from serial/int DB id to string
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
}

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}
