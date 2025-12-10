import { ErrorHandler } from './errorMiddleware.js';

/**
 * Request validation middleware using Joi schema
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return next(new ErrorHandler(`Validation error: ${error.details[0].message}`, 400));
    }

    // Replace request data with validated data
    if (source === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

export default validateRequest;
