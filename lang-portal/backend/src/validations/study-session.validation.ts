import Joi from 'joi';

export const createSessionSchema = Joi.object({
  userId: Joi.string().required(),
  sessionData: Joi.object({
    duration: Joi.number().required(),
    wordsStudied: Joi.array().items(Joi.string()).required(),
    correctAnswers: Joi.number().required(),
    incorrectAnswers: Joi.number().required(),
  }).required(),
});

export const updateSessionSchema = Joi.object({
  sessionData: Joi.object({
    duration: Joi.number(),
    wordsStudied: Joi.array().items(Joi.string()),
    correctAnswers: Joi.number(),
    incorrectAnswers: Joi.number(),
  }),
  status: Joi.string().valid('in_progress', 'completed', 'interrupted'),
});

export const getSessionsSchema = Joi.object({
  status: Joi.string().valid('in_progress', 'completed', 'interrupted'),
  startDate: Joi.date(),
  endDate: Joi.date(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
});
