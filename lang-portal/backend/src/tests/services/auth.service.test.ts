// Use var so that mockPrismaClient is hoisted
var mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Mock @prisma/client including a dummy PrismaClientKnownRequestError
jest.mock('@prisma/client', () => {
  class PrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  }
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientKnownRequestError,
    },
  };
});

// Mock bcrypt methods
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Now import AuthService (it will use the mocked PrismaClient)
import { AuthService } from '../../services/auth.service';
import { AppError } from '../../utils/appError';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
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
      // Ensure no user exists for the given email
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      // Create a fake user as returned from prisma.user.create
      const mockCreatedUser = {
        id: '1',
        email: mockUserData.email,
        passwordHash: 'hashed_password',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.user.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

      const result = await authService.register(mockUserData);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: mockUserData.email,
        })
      );
    });

    it('should throw error if email already exists', async () => {
      // Simulate existing user found by findUnique
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce({ email: mockUserData.email });

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
      const mockUser = {
        id: '1',
        email: mockCredentials.email,
        passwordHash: 'hashed_password',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await authService.login(mockCredentials.email, mockCredentials.password);

      // Use flexible assertions for dynamic values (like token and id)
      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            email: mockUser.email,
          }),
        })
      );
    });

    it('should throw error for invalid credentials', async () => {
      // Simulate user not found
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.login(mockCredentials.email, mockCredentials.password))
        .rejects
        .toThrow(new AppError(401, 'Invalid credentials'));
    });
  });
});
