import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import AuthService from '../services/authService.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
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

    const { user, accessToken, refreshToken, signUpTime } = await AuthService.signup(value);

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
        signUpTime,
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

    try {
      const { user, accessToken, refreshToken, signInTime } = await AuthService.login(value);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          user,
          accessToken,
          refreshToken,
          signInTime,
        },
      });
    } catch (err) {
      // If user not found / invalid credentials, auto-register using provided email/password
      if (err && err.statusCode === 401) {
        const { email, password } = req.body;
        if (email && password) {
          // generate username from email local part (alphanum only for validation)
          const local = (email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
          let username = local || `user${Date.now().toString().slice(-6)}`;
          // ensure username is at least 3 chars
          if (username.length < 3) {
            username = `user${Date.now().toString().slice(-6)}`;
          }
          // attempt to signup
          const signupPayload = { username, email, password };
          const created = await AuthService.signup(signupPayload);
          return res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'User auto-registered and logged in',
            data: {
              user: created.user,
              accessToken: created.accessToken,
              refreshToken: created.refreshToken,
              signUpTime: created.signUpTime,
            },
          });
        }
      }
      throw err;
    }
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

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login with Google successful',
      data: { user, accessToken, refreshToken, signInTime: new Date().toISOString() },
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

