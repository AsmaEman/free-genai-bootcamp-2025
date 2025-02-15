import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import config from '../config';
import { UserData } from '../types/user';

const prisma = new PrismaClient();

export class AuthService {
  async findUserByEmail(email: string): Promise<UserData | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          isEmailVerified: true,
          settings: true,
          progress: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) return null;

      return {
        ...user,
        isEmailVerified: user.isEmailVerified,
        settings: user.settings as UserData['settings'],
        progress: user.progress as unknown as UserData['progress'],
      };
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<UserData> {
    try {
      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          isEmailVerified: false,
          settings: {
            preferredLanguage: 'en',
            notifications: { email: true, push: true }
          },
          progress: {
            level: 1,
            experience: 0,
            totalWordsLearned: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: new Date(),
            achievements: []
          }
        }
      });

      return {
        ...user,
        isEmailVerified: user.isEmailVerified,
        settings: user.settings as UserData['settings'],
        progress: user.progress as unknown as UserData['progress'],
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError(400, 'Email already exists');
        }
      }
      throw error;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    return this.createUser(userData);
  }

  async login(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        throw new AppError(401, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid credentials');
      }

      const token = this.generateToken(user);
      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  private generateToken(user: UserData): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '1d' }
    );
  }

  async resetPassword(email: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the database with an expiration
    // 3. Send an email to the user with a reset link
    // For now, we'll just throw a "not implemented" error
    throw new AppError(501, 'Password reset not implemented');
  }

  async verifyEmail(token: string) {
    // In a real application, you would:
    // 1. Verify the email verification token
    // 2. Update the user's email verification status
    // For now, we'll just throw a "not implemented" error
    throw new AppError(501, 'Email verification not implemented');
  }
}
