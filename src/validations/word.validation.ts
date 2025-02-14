import Joi from 'joi';

export const createWordSchema = Joi.object({
  arabicText: Joi.string().required(),
  diacritics: Joi.string().allow(''),
  englishTranslation: Joi.string().required(),
  examples: Joi.array().items(Joi.string()),
  audioUrl: Joi.string().uri().allow(''),
  tags: Joi.array().items(Joi.string()),
  metadata: Joi.object({
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    category: Joi.string().required(),
    usage: Joi.array().items(Joi.string())
  }),
  relatedWords: Joi.array().items(Joi.string())
});

export const updateWordSchema = createWordSchema.fork(
  ['arabicText', 'englishTranslation', 'metadata'],
  (schema) => schema.optional()
);

export const searchWordSchema = Joi.object({
  query: Joi.string().required(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  category: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});
