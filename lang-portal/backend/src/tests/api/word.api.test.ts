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
  word: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

import request from 'supertest';
import { app } from '../../app';

describe('Word API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/words', () => {
    const validWord = {
      arabicText: 'مرحبا',
      englishTranslation: 'hello',
      diacritics: 'مَرْحَبًا',
      examples: ['مرحبا بك', 'مرحبا وسهلا'],
      tags: ['greeting', 'basic'],
    };

    it('should create a new word', async () => {
      const mockCreatedWord = {
        id: '1',
        ...validWord,
        audioUrl: null,
        metadata: {},
        relatedWords: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.word.create.mockResolvedValueOnce(mockCreatedWord);

      const response = await request(app)
        .post('/api/words')
        .set('Authorization', 'Bearer test-token')
        .send(validWord)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: expect.any(String),
          arabicText: validWord.arabicText,
          englishTranslation: validWord.englishTranslation,
        }),
      });
    });

    it('should return 400 for invalid word data', async () => {
      const invalidWord = {
        arabicText: '',
        englishTranslation: '',
      };

      const response = await request(app)
        .post('/api/words')
        .set('Authorization', 'Bearer test-token')
        .send(invalidWord)
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: expect.any(String),
      });
    });
  });

  describe('GET /api/words/search', () => {
    it('should search words', async () => {
      const mockWords = [
        { 
          id: '1', 
          arabicText: 'مرحبا', 
          englishTranslation: 'hello',
          diacritics: null,
          examples: [],
          tags: [],
          metadata: {},
          relatedWords: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { 
          id: '2', 
          arabicText: 'شكرا', 
          englishTranslation: 'thank you',
          diacritics: null,
          examples: [],
          tags: [],
          metadata: {},
          relatedWords: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.word.findMany.mockResolvedValueOnce(mockWords);
      mockPrismaClient.word.count.mockResolvedValueOnce(2);

      const response = await request(app)
        .get('/api/words/search')
        .query({ query: 'hello' })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: {
          words: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              arabicText: expect.any(String),
              englishTranslation: expect.any(String),
              diacritics: null,
              examples: expect.any(Array),
              tags: expect.any(Array),
              metadata: expect.any(Object),
              relatedWords: expect.any(Array),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
            pages: 1,
          },
        },
      });
    });

    it('should return empty results for no matches', async () => {
      mockPrismaClient.word.findMany.mockResolvedValueOnce([]);
      mockPrismaClient.word.count.mockResolvedValueOnce(0);

      const response = await request(app)
        .get('/api/words/search')
        .set('Authorization', 'Bearer test-token')
        .query({ query: 'nonexistent' })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: {
          words: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
          },
        },
      });
    });

    it('should return 400 if no query parameter', async () => {
      const response = await request(app)
        .get('/api/words/search')
        .set('Authorization', 'Bearer test-token')
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Search query is required',
      });
    });
  });

  describe('GET /api/words/:id', () => {
    it('should get a word by id', async () => {
      const mockWord = {
        id: '1',
        arabicText: 'مرحبا',
        englishTranslation: 'hello',
        diacritics: 'مَرْحَبًا',
        examples: ['مرحبا بك'],
        tags: ['greeting'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.word.findUnique.mockResolvedValueOnce(mockWord);

      const response = await request(app)
        .get('/api/words/1')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: mockWord.id,
          arabicText: mockWord.arabicText,
          englishTranslation: mockWord.englishTranslation,
        }),
      });
    });

    it('should return 404 for non-existent word', async () => {
      mockPrismaClient.word.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/api/words/999')
        .expect(404);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Word not found',
      });
    });
  });

  describe('PUT /api/words/:id', () => {
    it('should update a word', async () => {
      const updateData = {
        englishTranslation: 'hi',
        examples: ['مرحبا بك', 'مرحبا وسهلا'],
      };

      const mockUpdatedWord = {
        id: '1',
        arabicText: 'مرحبا',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.word.findUnique.mockResolvedValueOnce(mockUpdatedWord);
      mockPrismaClient.word.update.mockResolvedValueOnce(mockUpdatedWord);

      const response = await request(app)
        .put('/api/words/1')
        .set('Authorization', 'Bearer test-token')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: '1',
          englishTranslation: updateData.englishTranslation,
        }),
      });
    });
  });

  describe('DELETE /api/words/:id', () => {
    it('should delete a word', async () => {
      mockPrismaClient.word.findUnique.mockResolvedValueOnce({ id: '1' });
      mockPrismaClient.word.delete.mockResolvedValueOnce({ id: '1' });

      await request(app)
        .delete('/api/words/1')
        .set('Authorization', 'Bearer test-token')
        .expect(204);
    });
  });
}); 