import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import AuthService from '../services/authService.js';
import { setTokenCookie, clearTokenCookie } from '../utils/jwtToken.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { signupSchema, loginSchema, refreshTokenSchema } from '../schemas/authSchema.js';
import { verifyIdToken } from '../utils/googleAuth.js';


export const signup = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { user, accessToken, refreshToken } = await AuthService.signup(value);

    setTokenCookie(res, accessToken, 'accessToken');
    setTokenCookie(res, refreshToken, 'refreshToken');

    if (user.email) {
      sendWelcomeEmail(user.email, user.fullName || user.username).catch((err) => {
        console.error('Error sending welcome email:', err);
      });
    }

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { user, accessToken, refreshToken } = await AuthService.login(value);

    setTokenCookie(res, accessToken, 'accessToken');
    setTokenCookie(res, refreshToken, 'refreshToken');

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Google Sign-In
 * POST /api/v1/auth/google
 */
export const googleSignIn = catchAsyncErrors(async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return next(new ErrorHandler('idToken is required', 400));
    }

    const payload = await verifyIdToken(idToken);

    const { user, accessToken, refreshToken } = await AuthService.googleLogin(payload);

    setTokenCookie(res, accessToken, 'accessToken');
    setTokenCookie(res, refreshToken, 'refreshToken');

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login with Google successful',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
});

export const refreshToken = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = refreshTokenSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(
      value.refreshToken
    );

    setTokenCookie(res, accessToken, 'accessToken');
    setTokenCookie(res, newRefreshToken, 'refreshToken');

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  try {
    clearTokenCookie(res, 'accessToken');
    clearTokenCookie(res, 'refreshToken');

    await AuthService.logout(req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Request Password Reset
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler('Email is required', 400));
    }

    const result = await AuthService.requestPasswordReset(email);

    // Send reset email
    if (result.resetToken) {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${result.resetToken}`;
      sendPasswordResetEmail(email, 'User', resetLink).catch((err) => {
        console.error('Error sending password reset email:', err);
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'If email exists, password reset link will be sent',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Reset Password
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword) {
      return next(new ErrorHandler('Reset token and new password are required', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler('Passwords do not match', 400));
    }

    const result = await AuthService.resetPassword(resetToken, newPassword);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get Current User
 * GET /api/v1/auth/me
 */
export const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User profile retrieved',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
});

