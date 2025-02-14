import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/error.middleware';
import config from '../config';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      settings: {
        preferredLanguage: 'en',
        notifications: {
          email: true,
          push: true,
        },
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
    });

    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  async resetPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

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
