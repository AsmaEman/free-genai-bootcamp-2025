import request from 'supertest';
import { app } from '../../app';

// Use var for hoisting
var mockPrismaClient = {
  word: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

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
      mockPrismaClient.word.create.mockResolvedValueOnce({
        id: '1',
        ...validWord,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/words')
        .send(validWord)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        data: expect.objectContaining({
          id: expect.any(String),
          arabicText: validWord.arabicText,
        }),
      });
    });
  });

  describe('GET /api/words/:id', () => {
    it('should get a word by id', async () => {
      const mockWord = {
        id: '1',
        arabicText: 'مرحبا',
        englishTranslation: 'hello',
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
        }),
      });
    });
  });

  describe('GET /api/words/search', () => {
    it('should search words', async () => {
      const mockWords = [
        { id: '1', arabicText: 'مرحبا', englishTranslation: 'hello' },
        { id: '2', arabicText: 'شكرا', englishTranslation: 'thank you' },
      ];

      mockPrismaClient.word.findMany.mockResolvedValueOnce(mockWords);
      mockPrismaClient.word.count.mockResolvedValueOnce(2);

      const response = await request(app)
        .get('/api/words/search?query=hello')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: {
          words: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
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
  });
}); 