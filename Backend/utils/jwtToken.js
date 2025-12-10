import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate JWT access token
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire,
      algorithm: config.jwt.algorithm,
    }
  );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpire,
      algorithm: config.jwt.algorithm,
    }
  );
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (userId, role) => {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Set JWT token in response cookie
 */
export const setTokenCookie = (res, token, tokenName = 'token') => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: config.security.cookieSecure,
    sameSite: config.security.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clear JWT token cookie
 */
export const clearTokenCookie = (res, tokenName = 'token') => {
  res.clearCookie(tokenName);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    throw new Error(`Refresh token verification failed: ${error.message}`);
  }
};

