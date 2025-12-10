import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: config.rateLimit.message,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  skip: (req) => !config.rateLimit.enabled,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
});

export const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.authMaxRequests,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  skip: (req) => !config.rateLimit.enabled,
  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
});

/**
 * Admin endpoints rate limiter (more permissive)
 */
export const adminLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.adminMaxRequests,
  message: config.rateLimit.message,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  skip: (req) => !config.rateLimit.enabled || (req.user && req.user.role === 'admin'),
  keyGenerator: (req) => req.user ? req.user._id.toString() : req.ip,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'Too many uploads, please try again later.',
  skip: (req) => !config.rateLimit.enabled || (req.user && req.user.role === 'admin'),
  keyGenerator: (req) => req.user ? req.user._id.toString() : req.ip,
});

export default apiLimiter;
