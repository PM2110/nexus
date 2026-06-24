import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { config } from '../config/env';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded as { id: string; email: string; role: string };
    next();
  });
};
