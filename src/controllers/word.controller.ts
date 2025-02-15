import { Request, Response, NextFunction } from 'express';
import { WordService } from '../services/word.service';
import { AppError } from '../middleware/error.middleware';

export class WordController {
  private wordService: WordService;

  constructor() {
    this.wordService = new WordService();
  }

  createWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      const { query, page = 1, limit = 10 } = req.query;
      
      if (!query) {
        throw new AppError(400, 'Search query is required');
      }

      const result = await this.wordService.searchWords({
        query: query as string,
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

  updateWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const word = await this.wordService.updateWord(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: word,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteWord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.wordService.deleteWord(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getRelatedWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relatedWords = await this.wordService.getRelatedWords(req.params.id);
      res.status(200).json({
        status: 'success',
        data: relatedWords,
      });
    } catch (error) {
      next(error);
    }
  };
}
