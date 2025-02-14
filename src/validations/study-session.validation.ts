import Joi from 'joi';

export const createSessionSchema = Joi.object({
  userId: Joi.string().required(),
  sessionData: Joi.object({
    wordsStudied: Joi.array().items(Joi.string()).required(),
    correctAnswers: Joi.number().integer().min(0).required(),
    incorrectAnswers: Joi.number().integer().min(0).required(),
    duration: Joi.number().integer().min(0).required()
  }).required(),
  status: Joi.string().valid('completed', 'interrupted', 'in_progress').required(),
  performance: Joi.object({
    accuracy: Joi.number().min(0).max(100).required(),
    averageResponseTime: Joi.number().min(0).required(),
    masteryLevel: Joi.number().min(0).max(100).required()
  }).required()
});

export const updateSessionSchema = Joi.object({
  sessionData: Joi.object({
    wordsStudied: Joi.array().items(Joi.string()),
    correctAnswers: Joi.number().integer().min(0),
    incorrectAnswers: Joi.number().integer().min(0),
    duration: Joi.number().integer().min(0)
  }),
  status: Joi.string().valid('completed', 'interrupted', 'in_progress'),
  performance: Joi.object({
    accuracy: Joi.number().min(0).max(100),
    averageResponseTime: Joi.number().min(0),
    masteryLevel: Joi.number().min(0).max(100)
  })
});

export const getSessionsSchema = Joi.object({
  userId: Joi.string().required(),
  status: Joi.string().valid('completed', 'interrupted', 'in_progress'),
  startDate: Joi.date(),
  endDate: Joi.date(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});
