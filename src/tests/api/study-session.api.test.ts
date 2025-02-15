// Set NODE_ENV to 'test' before anything else
process.env.NODE_ENV = 'test';

// Mock auth middleware before importing app
jest.mock('../../middleware/auth.middleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: '1', email: 'test@example.com' };
    next();
  },
}));

var mockPrismaClient = {
  studySession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Now import the app
import request from 'supertest';
import { app } from '../../app';

describe('Study Session API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/study-sessions', () => {
    const validSession = {
      userId: '1',
      sessionData: {
        duration: 1800,
        wordsStudied: ['1', '2', '3'],
        correctAnswers: 8,
        incorrectAnswers: 2,
      },
    };

    it('should create a new study session', async () => {
      const mockCreatedSession = {
        id: '1',
        ...validSession,
        status: 'in_progress',
        performance: {
          accuracy: 0.8,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.studySession.create.mockResolvedValueOnce(mockCreatedSession);

      const response = await request(app)
        .post('/api/study-sessions')
        .set('Authorization', 'Bearer test-token')
        .send(validSession)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: expect.any(String),
          userId: validSession.userId,
          status: 'in_progress',
        }),
      });
    });

    // Add more test cases...
  });

  describe('GET /api/study-sessions/:id', () => {
    it('should get a study session by id', async () => {
      const mockSession = {
        id: '1',
        userId: '1',
        sessionData: {
          duration: 1800,
          wordsStudied: ['1', '2', '3'],
        },
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.studySession.findUnique.mockResolvedValueOnce(mockSession);

      const response = await request(app)
        .get('/api/study-sessions/1')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: mockSession.id,
          userId: mockSession.userId,
        }),
      });
    });
  });

  describe('GET /api/study-sessions/user/:userId', () => {
    it('should get user study sessions', async () => {
      const mockSessions = [
        {
          id: '1',
          userId: '1',
          sessionData: { duration: 1800 },
          status: 'completed',
        },
        {
          id: '2',
          userId: '1',
          sessionData: { duration: 2400 },
          status: 'completed',
        },
      ];

      mockPrismaClient.studySession.findMany.mockResolvedValueOnce(mockSessions);

      const response = await request(app)
        .get('/api/study-sessions/user/1')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            userId: '1',
          }),
        ]),
      });
    });
  });
}); 