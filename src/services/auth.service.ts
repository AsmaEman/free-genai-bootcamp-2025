import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import config from '../config';

const prisma = new PrismaClient();

type CreateUserInput = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
};

export class AuthService {
  async findUserByEmail(email: string) {
    try {
      const prismaUser = await prisma.user.findUnique({
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
          studySessions: true,
          wordProgress: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!prismaUser) return null;

      return prismaUser as unknown as User;
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  }

  async createUser(data: CreateUserInput) {
    try {
      const prismaUser = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
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
          studySessions: true,
          wordProgress: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return prismaUser as unknown as User;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError(400, 'Email already exists');
        }
      }
      throw error;
    }
  }

  async register(userData: CreateUserInput) {
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

  private generateToken(user: User): string {
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
