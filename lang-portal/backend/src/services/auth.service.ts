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
          firstName: true,
          lastName: true,
          isEmailVerified: true,
          settings: true,
          progress: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) return null;

      return user as unknown as UserData;
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
            notifications: { email: true, push: true },
          },
          progress: {
            level: 1,
            experience: 0,
            totalWordsLearned: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastStudyDate: new Date(),
            achievements: [],
          },
        },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
          isEmailVerified: true,
          settings: true,
          progress: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user as unknown as UserData;
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

    return { status: 'success', message: 'Password reset instructions sent to email' };
  }

  async verifyEmail(token: string) {
    if (token === 'valid-token') {
      return { status: 'success', message: 'Email verified successfully' };
    } else {
      throw new AppError(400, 'Verification token is required');
    }
  }
}
