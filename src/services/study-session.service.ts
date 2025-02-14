import { getRepository } from 'typeorm';
import { StudySession } from '../models/StudySession';
import { WordProgress } from '../models/WordProgress';
import { AppError } from '../middleware/error.middleware';

export class StudySessionService {
  private sessionRepository = getRepository(StudySession);
  private progressRepository = getRepository(WordProgress);

  async createSession(sessionData: Partial<StudySession>): Promise<StudySession> {
    const session = this.sessionRepository.create(sessionData);
    await this.sessionRepository.save(session);

    // Update word progress for studied words
    if (session.sessionData.wordsStudied.length > 0) {
      await this.updateWordProgress(session);
    }

    return session;
  }

  private async updateWordProgress(session: StudySession): Promise<void> {
    const { wordsStudied, correctAnswers, duration } = session.sessionData;
    const totalAnswers = correctAnswers + session.sessionData.incorrectAnswers;
    const accuracy = (correctAnswers / totalAnswers) * 100;

    for (const wordId of wordsStudied) {
      let progress = await this.progressRepository.findOne({
        where: {
          userId: session.userId,
          wordId,
        },
      });

      if (!progress) {
        progress = this.progressRepository.create({
          userId: session.userId,
          wordId,
          masteryLevel: 0,
          timesReviewed: 0,
          reviewHistory: [],
        });
      }

      // Update progress based on session performance
      progress.timesReviewed += 1;
      progress.reviewHistory.push({
        date: session.createdAt,
        correct: true, // This should be tracked per word in the session
        responseTime: duration / wordsStudied.length, // Average response time
      });

      // Calculate new mastery level (simplified version)
      const newMasteryLevel = (progress.masteryLevel + accuracy) / 2;
      progress.masteryLevel = Math.min(newMasteryLevel, 100);

      // Calculate next review date using spaced repetition
      progress.nextReviewDate = this.calculateNextReviewDate(progress.masteryLevel);

      await this.progressRepository.save(progress);
    }
  }

  private calculateNextReviewDate(masteryLevel: number): Date {
    // Simple spaced repetition algorithm
    // Higher mastery level = longer interval between reviews
    const baseInterval = 24; // hours
    const multiplier = Math.floor(masteryLevel / 20); // 0-5 based on mastery level
    const intervalHours = baseInterval * (multiplier + 1);
    
    const nextDate = new Date();
    nextDate.setHours(nextDate.getHours() + intervalHours);
    return nextDate;
  }

  async getSession(id: string): Promise<StudySession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!session) {
      throw new AppError(404, 'Study session not found');
    }

    return session;
  }

  async getUserSessions(params: {
    userId: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
  }): Promise<{ sessions: StudySession[]; pagination: any }> {
    const { userId, status, startDate, endDate, page, limit } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('session.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('session.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('session.createdAt <= :endDate', { endDate });
    }

    const total = await queryBuilder.getCount();

    const sessions = await queryBuilder
      .orderBy('session.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      sessions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateSession(id: string, updateData: Partial<StudySession>): Promise<StudySession> {
    const session = await this.getSession(id);
    
    // If session is being marked as completed, update word progress
    if (updateData.status === 'completed' && session.status !== 'completed') {
      await this.updateWordProgress({ ...session, ...updateData });
    }

    Object.assign(session, updateData);
    return await this.sessionRepository.save(session);
  }

  async deleteSession(id: string): Promise<void> {
    const session = await this.getSession(id);
    await this.sessionRepository.remove(session);
  }
}
