import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { PrismaClient } from '@prisma/client';

// Mock database connection
jest.mock('../config/database', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(true),
    getRepository: jest.fn(),
  },
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  jest.clearAllMocks();
}); 