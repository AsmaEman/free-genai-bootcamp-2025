import { getRepository } from 'typeorm';
import { Word } from '../models/Word';
import { AppError } from '../middleware/error.middleware';
import { Like } from 'typeorm';

export class WordService {
  private wordRepository = getRepository(Word);

  async createWord(wordData: Partial<Word>): Promise<Word> {
    const word = this.wordRepository.create(wordData);
    return await this.wordRepository.save(word);
  }

  async getWord(id: string): Promise<Word> {
    const word = await this.wordRepository.findOne({ where: { id } });
    if (!word) {
      throw new AppError(404, 'Word not found');
    }
    return word;
  }

  async searchWords(params: {
    query: string;
    difficulty?: string;
    category?: string;
    page: number;
    limit: number;
  }) {
    const { query, difficulty, category, page, limit } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.wordRepository.createQueryBuilder('word');

    // Basic search on arabicText or englishTranslation
    queryBuilder.where(
      '(word.arabicText ILIKE :query OR word.englishTranslation ILIKE :query)',
      { query: `%${query}%` }
    );

    // Add filters if provided
    if (difficulty) {
      queryBuilder.andWhere('word.metadata->\'difficulty\' = :difficulty', { difficulty });
    }

    if (category) {
      queryBuilder.andWhere('word.metadata->\'category\' = :category', { category });
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Add pagination
    queryBuilder.skip(skip).take(limit);

    // Get results
    const words = await queryBuilder.getMany();

    return {
      words,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateWord(id: string, updateData: Partial<Word>): Promise<Word> {
    const word = await this.getWord(id);
    Object.assign(word, updateData);
    return await this.wordRepository.save(word);
  }

  async deleteWord(id: string): Promise<void> {
    const word = await this.getWord(id);
    await this.wordRepository.remove(word);
  }

  async getRelatedWords(id: string): Promise<Word[]> {
    const word = await this.getWord(id);
    if (!word.relatedWords || word.relatedWords.length === 0) {
      return [];
    }
    return await this.wordRepository.findByIds(word.relatedWords);
  }
}
