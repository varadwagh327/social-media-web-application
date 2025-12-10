import Joi from 'joi';


export const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Full name cannot exceed 100 characters',
    }),
  bio: Joi.string()
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Bio cannot exceed 500 characters',
    }),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 50 characters',
    }),
});

export const getUserSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required',
    }),
});
