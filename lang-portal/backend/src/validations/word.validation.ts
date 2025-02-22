import Joi from 'joi';

export const createWordSchema = Joi.object({
  arabicText: Joi.string().required(),
  englishTranslation: Joi.string().required(),
  diacritics: Joi.string(),
  examples: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
});

export const updateWordSchema = Joi.object({
  arabicText: Joi.string(),
  englishTranslation: Joi.string(),
  diacritics: Joi.string(),
  examples: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
});

export const searchWordSchema = Joi.object({
  query: Joi.string().required().messages({
    'string.empty': 'Search query is required',
    'any.required': 'Search query is required'
  }),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
}).unknown(true); // Allow unknown query parameters
