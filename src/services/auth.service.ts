import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateInput } from '../models/User';
import { AppError } from '../middleware/error.middleware';
import config from '../config';

const prisma = new PrismaClient();

export class AuthService {
  async findUserByEmail(email: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!existingUser) return null;
    
    return {
      ...existingUser,
      firstName: '',
      lastName: '',
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
      },
      studySessions: [],
      wordProgress: []
    };
  }

  async createUser(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  async register(userData: Omit<UserCreateInput, 'progress' | 'createdAt' | 'updatedAt'>) {
    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
    const user = await this.createUser({
      email: userData.email,
      passwordHash: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isEmailVerified: false,
      settings: userData.settings,
      progress: {
        level: 1,
        experience: 0,
        totalWordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: new Date(),
        achievements: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  }

  async login(email: string, passwordHash: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user as User);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
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
      },
      config.jwtSecret,
      { expiresIn: '1h' }
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
