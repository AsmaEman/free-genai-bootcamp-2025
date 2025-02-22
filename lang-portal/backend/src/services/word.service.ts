import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

export class WordService {
  async createWord(data: {
    arabicText: string;
    englishTranslation: string;
    diacritics?: string;
    examples?: string[];
    tags?: string[];
  }) {
    try {
      const word = await prisma.word.create({
        data: {
          ...data,
          metadata: {},
          relatedWords: [],
        },
      });
      return word;
    } catch (error) {
      throw new AppError(400, 'Error creating word');
    }
  }

  async getWord(id: string) {
    const word = await prisma.word.findUnique({
      where: { id },
    });

    if (!word) {
      throw new AppError(404, 'Word not found');
    }

    return word;
  }

  async searchWords(params: { query: string; page: number; limit: number }) {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    try {
      const [words, total] = await Promise.all([
        prisma.word.findMany({
          where: {
            OR: [
              { arabicText: { contains: query, mode: 'insensitive' } },
              { englishTranslation: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            arabicText: true,
            englishTranslation: true,
            diacritics: true,
            examples: true,
            tags: true,
            metadata: true,
            relatedWords: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.word.count({
          where: {
            OR: [
              { arabicText: { contains: query, mode: 'insensitive' } },
              { englishTranslation: { contains: query, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      return {
        words,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new AppError(500, 'Error searching words');
    }
  }

  async updateWord(id: string, data: Partial<{
    arabicText: string;
    englishTranslation: string;
    diacritics: string;
    examples: string[];
    tags: string[];
  }>) {
    await this.getWord(id);

    const word = await prisma.word.update({
      where: { id },
      data,
    });

    return word;
  }

  async deleteWord(id: string) {
    await this.getWord(id);
    await prisma.word.delete({
      where: { id },
    });
  }

  async getRelatedWords(id: string) {
    const word = await this.getWord(id);
    if (!word.relatedWords || word.relatedWords.length === 0) {
      return [];
    }

    const relatedWords = await prisma.word.findMany({
      where: {
        id: { in: word.relatedWords },
      },
    });

    return relatedWords;
  }
}
