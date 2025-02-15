import { Request, Response, NextFunction } from 'express';
import { StudySessionService } from '../services/study-session.service';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middleware/auth.middleware';

export class StudySessionController {
  private studySessionService: StudySessionService;

  constructor() {
    this.studySessionService = new StudySessionService();
  }

  createSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const sessionData = {
        ...req.body,
        userId: req.user.id,
      };

      const session = await this.studySessionService.createSession(sessionData);
      res.status(201).json({
        status: 'success',
        data: session,
      });
    } catch (error) {
      next(error);
    }
  };

  getSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const session = await this.studySessionService.getSession(req.params.id);
      
      if (session.userId !== req.user.id) {
        throw new AppError(403, 'Not authorized to access this session');
      }

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
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const sessions = await this.studySessionService.getUserSessions(req.user.id);
      res.status(200).json({
        status: 'success',
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const session = await this.studySessionService.getSession(req.params.id);
      
      if (session.userId !== req.user.id) {
        throw new AppError(403, 'Not authorized to update this session');
      }

      const updatedSession = await this.studySessionService.updateSession(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: updatedSession,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const session = await this.studySessionService.getSession(req.params.id);
      
      if (session.userId !== req.user.id) {
        throw new AppError(403, 'Not authorized to delete this session');
      }

      await this.studySessionService.deleteSession(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
