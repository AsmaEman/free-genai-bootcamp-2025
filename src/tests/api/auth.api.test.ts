// Set NODE_ENV to 'test' before anything else
process.env.NODE_ENV = 'test';

// MOCKS: Declare all mocks before importing app
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Use var so that the variable is hoisted
var mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Mock the Prisma module before importing app
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

// Now import supertest and your app (which uses AuthService)
import request from 'supertest';
import { app } from '../../app';

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      const mockCreatedUser = {
        id: '1',
        email: validUser.email,
        passwordHash: 'hashed_password',
        firstName: validUser.firstName,
        lastName: validUser.lastName,
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

      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaClient.user.create.mockResolvedValueOnce(mockCreatedUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: expect.any(String),
          email: validUser.email,
        }),
      });
    });

    it('should return 400 for missing required fields', async () => {
      const invalidUser = {
        email: 'test@example.com',
        // Missing password, firstName, lastName
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: expect.any(String),
      });
    });

    it('should return 400 for existing email', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({ email: validUser.email });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Email already registered',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login user', async () => {
      const mockUser = {
        id: '1',
        email: validCredentials.email,
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

      mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials)
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            email: validCredentials.email,
          }),
        }),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials)
        .expect(401);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid credentials',
      });
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should initiate password reset process', async () => {
      const email = 'test@example.com';
      mockPrismaClient.user.findUnique.mockResolvedValueOnce({
        email,
        id: '1',
      });

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        message: 'Password reset instructions sent to email',
      });
    });

    it('should return 404 for non-existent email', async () => {
      const email = 'nonexistent@example.com';
      mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email })
        .expect(404);

      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found',
      });
    });
  });

  describe('GET /api/auth/verify-email/:token', () => {
    it('should verify email', async () => {
      const token = 'valid-token';

      const response = await request(app)
        .get(`/api/auth/verify-email/${token}`)
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        message: 'Email verified successfully',
      });
    });

    it('should return 400 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email/invalid-token')
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Verification token is required',
      });
    });
  });
});

// Teardown to prevent open handles (e.g. database connections)
import { PrismaClient } from '@prisma/client';
afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});
