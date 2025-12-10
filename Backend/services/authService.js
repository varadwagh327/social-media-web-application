import User from '../models/userSchema.js';
import { generateTokens } from '../utils/jwtToken.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';

export class AuthService {
  static async signup(userData) {
    const { username, email, password, fullName } = userData;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ErrorHandler('Email already registered', 409);
      }
      if (existingUser.username === username) {
        throw new ErrorHandler('Username already taken', 409);
      }
    }

    const user = new User({
      username,
      email,
      password,
      fullName,
      role: 'user',
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  static async login(loginData) {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new ErrorHandler('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorHandler('Invalid email or password', 401);
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new ErrorHandler('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new ErrorHandler('Account is inactive', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Google social login/signup
   */
  static async googleLogin(googlePayload) {
    const { email, email_verified, name, picture } = googlePayload || {};

    if (!email) {
      throw new ErrorHandler('Google account does not provide email', 400);
    }

    if (!email_verified) {
      throw new ErrorHandler('Google email is not verified', 400);
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a username from email local part
      const local = (email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
      let username = local || `user${Date.now().toString().slice(-6)}`;
      let attempt = 0;
      while (await User.findOne({ username })) {
        attempt += 1;
        username = `${local}${attempt}`;
      }

      user = new User({
        username,
        email,
        password: Math.random().toString(36).slice(-12),
        fullName: name || undefined,
        profilePicture: picture || null,
        emailVerified: true,
        role: 'user',
      });

      await user.save();
    } else {
      // Update basic info if missing
      let changed = false;
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
        changed = true;
      }
      if (!user.fullName && name) {
        user.fullName = name;
        changed = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        changed = true;
      }
      if (changed) await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ErrorHandler('Refresh token is required', 400);
    }

    try {
      const decoded = require('jsonwebtoken').verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      );

      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new ErrorHandler('Invalid refresh token or user not found', 401);
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user._id,
        user.role
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ErrorHandler('Invalid refresh token', 401);
    }
  }

  /**
   * Logout user (token invalidation can be done via Redis)
   */
  static async logout(userId) {
    // In a production app, you'd add the token to a blacklist (e.g., Redis)
    // For now, logout is handled client-side by deleting the token
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not
      return { success: true, message: 'If email exists, reset link will be sent' };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    return {
      success: true,
      resetToken,
      expiresIn: 3600,
      message: 'Password reset token generated',
    };
  }

  /**
   * Reset password with token
   */
  static async resetPassword(resetToken, newPassword) {
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorHandler('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save();

    return { success: true, message: 'Password reset successfully' };
  }
}

export default AuthService;
