import Joi from 'joi';


export const createPostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .trim()
    .max(5000)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 5000 characters',
    }),
  content: Joi.string()
    .trim()
    .max(10000)
    .optional()
    .messages({
      'string.max': 'Content cannot exceed 10000 characters',
    }),
  contentType: Joi.string()
    .valid('text', 'image', 'video', 'mixed')
    .optional()
    .default('text')
    .messages({
      'any.only': 'Content type must be one of: text, image, video, mixed',
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
    }),
  visibility: Joi.string()
    .valid('public', 'private', 'friends')
    .optional()
    .default('public')
    .messages({
      'any.only': 'Visibility must be one of: public, private, friends',
    }),
});

export const updatePostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Title cannot exceed 200 characters',
    }),
  description: Joi.string()
    .trim()
    .max(5000)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 5000 characters',
    }),
  content: Joi.string()
    .trim()
    .max(10000)
    .optional()
    .messages({
      'string.max': 'Content cannot exceed 10000 characters',
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Tags must be an array',
    }),
  visibility: Joi.string()
    .valid('public', 'private', 'friends')
    .optional()
    .messages({
      'any.only': 'Visibility must be one of: public, private, friends',
    }),
});

export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  sort: Joi.string()
    .optional()
    .default('-createdAt')
    .messages({
      'string.base': 'Sort must be a string',
    }),
});

export const commentSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Comment must not be empty',
      'string.max': 'Comment cannot exceed 1000 characters',
      'any.required': 'Comment content is required',
    }),
});
