import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

export class StudySessionService {
  async createSession(data: {
    userId: string;
    sessionData: {
      duration: number;
      wordsStudied: string[];
      correctAnswers: number;
      incorrectAnswers: number;
    };
  }) {
    try {
      const session = await prisma.studySession.create({
        data: {
          userId: data.userId,
          sessionData: data.sessionData,
          status: 'in_progress',
          performance: {
            accuracy: data.sessionData.correctAnswers / 
              (data.sessionData.correctAnswers + data.sessionData.incorrectAnswers),
          },
        },
      });
      return session;
    } catch (error) {
      throw new AppError(400, 'Error creating study session');
    }
  }

  async getSession(id: string) {
    const session = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new AppError(404, 'Study session not found');
    }

    return session;
  }

  async getUserSessions(userId: string) {
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return sessions;
  }

  async updateSession(id: string, data: any) {
    const session = await this.getSession(id);

    const updatedSession = await prisma.studySession.update({
      where: { id },
      data: {
        sessionData: data.sessionData || session.sessionData,
        status: data.status || session.status,
        performance: data.performance || session.performance,
      },
    });

    return updatedSession;
  }

  async deleteSession(id: string) {
    const session = await this.getSession(id);
    await prisma.studySession.delete({
      where: { id },
    });
  }
}

