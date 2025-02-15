import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { settings: { preferredLanguage: string; notifications: { email: boolean; push: boolean; }; }; } = req.body;

      if (!userData.email || !userData.passwordHash || !userData.firstName || !userData.lastName || !userData.settings || !userData.settings.preferredLanguage || !userData.settings.notifications) {
        throw new AppError(400, 'All fields are required');
      }

      const user = await this.authService.register({
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: false,
        settings: userData.settings,
      });

      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, passwordHash } = req.body;

      if (!email || !passwordHash) {
        throw new AppError(400, 'Email and passwordHash are required');
      }

      const user = await this.authService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid credentials');
      }

      const token = this.generateToken(user);
      const { passwordHash: _, ...userWithoutPassword } = user;

      res.status(200).json({
        status: 'success',
        data: { token, user: userWithoutPassword },
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError(400, 'Email is required');
      }

      await this.authService.resetPassword(email);

      res.status(200).json({
        status: 'success',
        message: 'Password reset instructions sent to email',
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      if (!token) {
        throw new AppError(400, 'Verification token is required');
      }

      await this.authService.verifyEmail(token);

      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  private generateToken(user: User) {
    // implement token generation logic here
  }
}
