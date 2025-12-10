import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/userSchema.js';
import { catchAsyncErrors } from './catchAsyncErrors.js';
import ErrorHandler from './errorMiddleware.js';

/**
 * Verify JWT token from request headers or cookies
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Extract token from request
 */
const extractToken = (req) => {
  // Check Authorization header (Bearer token)
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

/**
 * Middleware to authenticate user
 */
export const authenticate = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ErrorHandler('Authentication token is required', 401));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    if (!user.isActive) {
      return next(new ErrorHandler('User account is inactive', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

/**
 * Middleware to check if user is admin
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(
        `User role '${req.user.role}' is not authorized for this resource`,
        403
      ));
    }

    next();
  };
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ErrorHandler('Admin access required', 403));
  }
  next();
});

/**
 * Middleware to require moderator or admin
 */
export const requireModerator = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
    return next(new ErrorHandler('Moderator access required', 403));
  }
  next();
});

/**
 * Optional authentication - user data attached if token is valid
 */
export const optionalAuth = catchAsyncErrors(async (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid but not required, continue
    }
  }

  next();
});
