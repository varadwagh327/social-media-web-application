/**
 * Custom Error Handler Class
 */
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 * Catches and formats all application errors
 */
export const errorMiddleware = (err, req, res, next) => {
  // Default values
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
  };

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.statusCode = 400;
    error.message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(', ');
    error.statusCode = 400;
    error.message = messages;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token has expired';
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      error.statusCode = 413;
      error.message = `File too large. Max size: ${err.limit} bytes`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error.statusCode = 400;
      error.message = `Too many files uploaded. Max: ${err.limit}`;
    }
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    console.error('Stack:', err.stack);
  }

  // Return error response
  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default ErrorHandler;
