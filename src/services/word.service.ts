import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class WordService {
  async createWord(wordData: any): Promise<any> {
    const word = await prisma.word.create({
      data: wordData,
    });
    return word;
  }

  async getWord(id: string): Promise<any | null> {
    const word = await prisma.word.findUnique({
      where: { id },
    });
    if (!word) {
      throw new AppError(404, 'Word not found');
    }
    return word;
  }

  async searchWords(params: { query: string; page: number; limit: number; }) {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const words = await prisma.word.findMany({
      where: {
        OR: [
          { arabicText: { contains: query, mode: 'insensitive' } },
          { englishTranslation: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
    });

    const total = await prisma.word.count({
      where: {
        OR: [
          { arabicText: { contains: query, mode: 'insensitive' } },
          { englishTranslation: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return {
      words,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateWord(id: string, updateData: any): Promise<any> {
    const word = await this.getWord(id);
    return await prisma.word.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteWord(id: string): Promise<void> {
    await this.getWord(id);
    await prisma.word.delete({
      where: { id },
    });
  }

  async getRelatedWords(id: string): Promise<any[]> {
    const word = await this.getWord(id);
    if (!word || !word.relatedWords || word.relatedWords.length === 0) {
      return [];
    }
    return await prisma.word.findMany({
      where: {
        id: { in: word.relatedWords },
      },
    });
  }
}
