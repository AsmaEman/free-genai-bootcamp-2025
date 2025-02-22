import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/appError';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         settings:
 *           type: object
 *           properties:
 *             preferredLanguage:
 *               type: string
 *               default: 'en'
 *             notifications:
 *               type: object
 *               properties:
 *                 email:
 *                   type: boolean
 *                   default: true
 *                 push:
 *                   type: boolean
 *                   default: true
 */

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       201:
   *         description: User successfully registered
   *       400:
   *         description: Invalid input data
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        throw new AppError(400, 'Email, password, firstName, and lastName are required');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
      }

      const { user, token } = await this.authService.login(email, password);

      res.status(200).json({
        status: 'success',
        data: { token, user },
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
