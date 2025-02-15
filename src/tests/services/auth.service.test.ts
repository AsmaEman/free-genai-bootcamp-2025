import { AuthService } from '../../services/auth.service';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/appError';
import bcrypt from 'bcrypt';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    authService = new AuthService();
  });

  describe('register', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = await bcrypt.hash(mockUserData.password, 10);
      const mockCreatedUser = {
        id: '1',
        email: mockUserData.email,
        passwordHash: hashedPassword,
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

      const result = await authService.register(mockUserData);

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        email: mockUserData.email,
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
      }));
      expect(result.passwordHash).toBeDefined();
      expect(result.isEmailVerified).toBe(false);
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ email: mockUserData.email });

      await expect(authService.register(mockUserData))
        .rejects
        .toThrow(new AppError(400, 'Email already registered'));
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login user with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash(mockCredentials.password, 10);
      const mockUser = {
        id: '1',
        email: mockCredentials.email,
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authService.login(mockCredentials.email, mockCredentials.password);

      expect(result).toEqual(expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      }));
    });

    it('should throw error for invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.login(mockCredentials.email, mockCredentials.password))
        .rejects
        .toThrow(new AppError(401, 'Invalid credentials'));
    });
  });
}); 