import request from 'supertest';
import { app } from '../../app';

var mockPrismaClient = {
  studySession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

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
      mockPrismaClient.studySession.create.mockResolvedValueOnce({
        id: '1',
        ...validSession,
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/study-sessions')
        .send(validSession)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: expect.any(String),
          userId: validSession.userId,
        }),
      });
    });
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