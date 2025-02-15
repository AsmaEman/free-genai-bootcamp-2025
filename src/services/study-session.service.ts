import { PrismaClient, Prisma } from '@prisma/client';
import { StudySession } from '../models/StudySession';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

interface SessionDataType {
  [key: string]: any;
  duration: number;
  wordsStudied: string[];
  correctAnswers: number;
  incorrectAnswers: number;
}

export class StudySessionService {
  async createSession(
    sessionData: Omit<StudySession, 'id' | 'sessionData' | 'performance'> & {
      sessionData: SessionDataType;
    }
  ): Promise<StudySession> {
    const newSessionData: Prisma.StudySessionCreateInput = {
      user: { connect: { id: sessionData.userId } },
      status: sessionData.status || 'pending',
      sessionData: sessionData.sessionData,
      performance: {},
    };

    const session = await prisma.studySession.create({
      data: newSessionData,
      include: { user: true },
    });

    if (session.sessionData && (session.sessionData as SessionDataType).wordsStudied?.length > 0) {
      await this.updateWordProgress(session as unknown as StudySession);
    }

    return session as unknown as StudySession;
  }

  private async updateWordProgress(session: StudySession): Promise<void> {
    const sessionData = session.sessionData as SessionDataType;
    const totalAnswers = sessionData.correctAnswers + sessionData.incorrectAnswers;
    const accuracy = totalAnswers > 0 ? (sessionData.correctAnswers / totalAnswers) * 100 : 0;

    for (const wordId of sessionData.wordsStudied) {
      const existingProgress = await prisma.wordProgress.findFirst({
        where: {
          userId: session.userId,
          wordId: wordId,
        },
      });

      const reviewHistoryEntry = {
        date: session.createdAt,
        correct: true, // This should be tracked per word in the session
        responseTime: sessionData.duration / sessionData.wordsStudied.length,
      };

      const progressData: Prisma.WordProgressCreateInput | Prisma.WordProgressUpdateInput = {
        user: existingProgress ? undefined : { connect: { id: session.userId } },
        word: existingProgress ? undefined : { connect: { id: wordId } },
        masteryLevel: existingProgress 
          ? (existingProgress.masteryLevel + accuracy) / 2 
          : accuracy,
        timesReviewed: existingProgress 
          ? existingProgress.timesReviewed + 1 
          : 1,
        reviewHistory: existingProgress 
          ? { push: reviewHistoryEntry }
          : [reviewHistoryEntry],
        nextReviewDate: this.calculateNextReviewDate(
          existingProgress ? (existingProgress.masteryLevel + accuracy) / 2 : accuracy
        ),
      };

      if (existingProgress) {
        await prisma.wordProgress.update({
          where: { id: existingProgress.id },
          data: progressData,
        });
      } else {
        await prisma.wordProgress.create({
          data: progressData as Prisma.WordProgressCreateInput,
        });
      }
    }
  }

  private calculateNextReviewDate(masteryLevel: number): Date {
    const baseInterval = 24;
    const multiplier = Math.floor(masteryLevel / 20);
    const intervalHours = baseInterval * (multiplier + 1);
    
    const nextDate = new Date();
    nextDate.setHours(nextDate.getHours() + intervalHours);
    return nextDate;
  }

  async getSession(id: string): Promise<StudySession> {
    const session = await prisma.studySession.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!session) {
      throw new AppError(404, 'Study session not found');
    }

    return session as unknown as StudySession;
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

    const where: Prisma.StudySessionWhereInput = {
      userId,
      ...(status && { status }),
      ...(startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
    };

    const [sessions, total] = await Promise.all([
      prisma.studySession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: true },
      }),
      prisma.studySession.count({ where }),
    ]);

    return {
      sessions: sessions as unknown as StudySession[],
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateSession(
    id: string,
    sessionData: Partial<Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<StudySession> {
    const session = await this.getSession(id);
    
    if (sessionData.status === 'completed' && session.status !== 'completed') {
      const validatedSessionData = session.sessionData as SessionDataType;
      if (validatedSessionData) {
        await this.updateWordProgress({
          ...session,
          ...sessionData,
          sessionData: validatedSessionData,
        } as StudySession);
      }
    }

    const updateData: Prisma.StudySessionUpdateInput = {
      status: sessionData.status,
      sessionData: sessionData.sessionData as Prisma.InputJsonValue,
      performance: sessionData.performance as Prisma.InputJsonValue,
      updatedAt: new Date(),
    };

    const updatedSession = await prisma.studySession.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    return updatedSession as unknown as StudySession;
  }

  async deleteSession(id: string): Promise<void> {
    await this.getSession(id);
    await prisma.studySession.delete({
      where: { id },
    });
  }
}

