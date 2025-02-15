import { Request, Response, NextFunction } from 'express';
import { WordService } from '../services/word.service';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @swagger
 * /api/words:
 *   get:
 *     summary: Get all words
 *     tags: [Words]
 *     responses:
 *       200:
 *         description: List of words
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 */

export class WordController {
  private wordService: WordService;

  constructor() {
    this.wordService = new WordService();
  }

  createWord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const word = await this.wordService.createWord(req.body);
      res.status(201).json({
        status: 'success',
        data: word,
      });
    } catch (error) {
      next(error);
    }
  };

  getWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const word = await this.wordService.getWord(req.params.id);
      res.status(200).json({
        status: 'success',
        data: word,
      });
    } catch (error) {
      next(error);
    }
  };

  searchWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      
      if (!query || typeof query !== 'string') {
        throw new AppError(400, 'Search query is required');
      }

      const result = await this.wordService.searchWords({
        query,
        page,
        limit,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateWord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      const word = await this.wordService.updateWord(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: word,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteWord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated');
      }

      await this.wordService.deleteWord(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getRelatedWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const words = await this.wordService.getRelatedWords(req.params.id);
      res.status(200).json({
        status: 'success',
        data: words,
      });
    } catch (error) {
      next(error);
    }
  };
}
