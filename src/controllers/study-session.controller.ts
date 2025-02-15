import { Request, Response, NextFunction } from 'express';
import { StudySessionService } from '../services/study-session.service';
import { AppError } from '../utils/appError';

import { AuthRequest } from '../middleware/auth.middleware';

export class StudySessionController {
  private sessionService: StudySessionService;

  constructor() {
    this.sessionService = new StudySessionService();
  }

  createSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const sessionData = {
        ...req.body,
        userId,
      };

      const session = await this.sessionService.createSession(sessionData);
      res.status(201).json({
        status: 'success',
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await this.sessionService.getSession(req.params.id);
      res.status(200).json({
        status: 'success',
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

      const result = await this.sessionService.getUserSessions({
        userId,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: Number(page),
        limit: Number(limit),
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const session = await this.sessionService.updateSession(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      await this.sessionService.deleteSession(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
