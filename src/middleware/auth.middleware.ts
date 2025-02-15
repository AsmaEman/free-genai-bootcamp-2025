import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '../utils/appError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError(401, 'No token provided'));
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
      if (err) {
        return next(new AppError(401, 'Invalid token'));
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(new AppError(401, 'Token verification failed'));
  }
};
